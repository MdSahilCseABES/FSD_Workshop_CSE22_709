const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true, // two students cannot have the same roll number
  },
  course: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
  },
  email: {
    type: String,
  },
});

module.exports = mongoose.model("Student", studentSchema);
