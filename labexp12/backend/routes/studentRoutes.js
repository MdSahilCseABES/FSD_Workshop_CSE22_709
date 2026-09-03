// All the /api/students routes

const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// GET /api/students -> list all students
router.get("/", async function (req, res) {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students -> add a new student
router.post("/", async function (req, res) {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    // Error code 11000 is MongoDB's "duplicate key" error.
    // It happens here when the roll number is already used.
    if (err.code === 11000) {
      return res.status(400).json({ message: "This roll number already exists" });
    }
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/students/:id -> update a student
router.put("/:id", async function (req, res) {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "This roll number already exists" });
    }
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/students/:id -> remove a student
router.delete("/:id", async function (req, res) {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted", student: deletedStudent });
  } catch (err) {
    res.status(400).json({ message: "Invalid id" });
  }
});

module.exports = router;
