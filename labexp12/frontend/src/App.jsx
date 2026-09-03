// The main component. It holds the list of students and talks to the backend.

import React, { useState, useEffect } from "react";
import StudentForm from "./StudentForm.jsx";
import StudentList from "./StudentList.jsx";

// The backend address. On Render this is set to the deployed backend URL
// through an environment variable. Vite requires the VITE_ prefix.
const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/students";

function App() {
  // students  -> the list shown in the table
  // editingStudent -> the student being edited, or null when adding a new one
  // message   -> a small line shown at the top after an action
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Get the students from the backend
  async function loadStudents() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setMessage("Could not reach the server. Is the backend running?");
    }
    setLoading(false);
  }

  // useEffect with an empty [] runs only once, when the page first opens.
  // Without the empty array it would run after every render and keep
  // fetching forever.
  useEffect(function () {
    loadStudents();
  }, []);

  // Called by the form for both adding and updating
  async function saveStudent(student) {
    // If we are editing, send PUT to that student's id. Otherwise POST.
    const isEditing = editingStudent !== null;
    const url = isEditing ? API_URL + "/" + editingStudent._id : API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      const data = await response.json();

      // response.ok is true for status 200-299
      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage(isEditing ? "Student updated" : "Student added");
      setEditingStudent(null);
      loadStudents(); // reload so the table shows the change
    } catch (err) {
      setMessage("Something went wrong");
    }
  }

  async function deleteStudent(id) {
    // A simple browser confirm box so we do not delete by mistake
    const sure = window.confirm("Delete this student?");
    if (!sure) {
      return;
    }

    try {
      await fetch(API_URL + "/" + id, { method: "DELETE" });
      setMessage("Student deleted");
      loadStudents();
    } catch (err) {
      setMessage("Could not delete the student");
    }
  }

  // Puts the student's values into the form
  function startEditing(student) {
    setEditingStudent(student);
    setMessage("");
  }

  function cancelEditing() {
    setEditingStudent(null);
  }

  return (
    <div className="container">
      <h1>Student Management System</h1>
      <p className="subtitle">React + Express + MongoDB</p>

      {message && <div className="message">{message}</div>}

      <StudentForm
        onSave={saveStudent}
        editingStudent={editingStudent}
        onCancel={cancelEditing}
      />

      <h2>Student List ({students.length})</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <StudentList
          students={students}
          onEdit={startEditing}
          onDelete={deleteStudent}
        />
      )}
    </div>
  );
}

export default App;
