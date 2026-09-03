// All the /students routes are kept in this file so server.js stays short.

const express = require("express");
const Student = require("../models/Student");

// A router is a small group of routes that we plug into the main app
const router = express.Router();

// ---------- POST /students -> add a new student ----------
router.post("/", async function (req, res) {
  try {
    // req.body holds the JSON that the client sent
    const student = new Student({
      name: req.body.name,
      age: req.body.age,
      course: req.body.course,
      email: req.body.email,
    });

    const savedStudent = await student.save();

    // 201 means "created"
    res.status(201).json(savedStudent);
  } catch (err) {
    // This runs if a required field is missing
    res.status(400).json({ message: err.message });
  }
});

// ---------- GET /students -> retrieve all students ----------
router.get("/", async function (req, res) {
  try {
    // find() with no filter returns everything
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- GET /students/:id -> retrieve one student ----------
router.get("/:id", async function (req, res) {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    // Runs when the id is not a valid ObjectId, for example "abc"
    res.status(400).json({ message: "Invalid id" });
  }
});

// ---------- PUT /students/:id -> update a student by ID ----------
router.put("/:id", async function (req, res) {
  try {
    // new: true tells mongoose to return the updated document
    // instead of the old one. runValidators: true makes it check
    // the schema rules on the update too.
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- DELETE /students/:id -> delete a student ----------
router.delete("/:id", async function (req, res) {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid id" });
  }
});

module.exports = router;
