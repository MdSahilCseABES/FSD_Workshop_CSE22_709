// The form used for both adding a new student and editing an existing one.

import React, { useState, useEffect } from "react";

// An empty form, kept in one place so we can reuse it when clearing the form
const emptyForm = { name: "", rollNo: "", course: "", age: "", email: "" };

function StudentForm({ onSave, editingStudent, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  // When the parent gives us a student to edit, fill the boxes with its values.
  // This runs again whenever editingStudent changes.
  useEffect(
    function () {
      if (editingStudent) {
        setForm({
          name: editingStudent.name,
          rollNo: editingStudent.rollNo,
          course: editingStudent.course,
          age: editingStudent.age,
          email: editingStudent.email || "",
        });
      } else {
        setForm(emptyForm);
      }
    },
    [editingStudent]
  );

  // One function handles every input box.
  // event.target.name matches the name="" on the input, so we know
  // which field to change without writing five separate functions.
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    // Stops the browser from reloading the page, which is the default
    // behaviour when a form is submitted.
    event.preventDefault();

    onSave({
      name: form.name,
      rollNo: form.rollNo,
      course: form.course,
      age: Number(form.age), // the input gives text, the backend wants a number
      email: form.email,
    });

    // Clear the form only when adding. While editing, the parent decides.
    if (!editingStudent) {
      setForm(emptyForm);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{editingStudent ? "Edit Student" : "Add New Student"}</h2>

      <div className="row">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="rollNo"
          placeholder="Roll No"
          value={form.rollNo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="row">
        <input
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          required
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />
      </div>

      <input
        name="email"
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={handleChange}
      />

      <div className="buttons">
        <button type="submit">
          {editingStudent ? "Update Student" : "Add Student"}
        </button>

        {editingStudent && (
          <button type="button" className="grey" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default StudentForm;
