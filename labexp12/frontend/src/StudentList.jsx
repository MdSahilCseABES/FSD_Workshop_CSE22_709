// Shows all the students in a table with Edit and Delete buttons.

import React from "react";

function StudentList({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return <p className="card">No students yet. Add one using the form above.</p>;
  }

  return (
    <table className="card">
      <thead>
        <tr>
          <th>Roll No</th>
          <th>Name</th>
          <th>Course</th>
          <th>Age</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* map() turns the array of students into an array of table rows.
            The key tells React which row is which when the list changes. */}
        {students.map(function (student) {
          return (
            <tr key={student._id}>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              <td>{student.course}</td>
              <td>{student.age}</td>
              <td>{student.email || "-"}</td>
              <td>
                <button className="small" onClick={() => onEdit(student)}>
                  Edit
                </button>
                <button
                  className="small red"
                  onClick={() => onDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default StudentList;
