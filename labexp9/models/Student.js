// The Student model
//
// A schema describes what a student document should look like.
// Mongoose then checks every save against this shape, which the plain
// mongodb driver does not do for us.

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // cannot be saved without a name
  },
  age: {
    type: Number,
    required: true,
    min: 1, // rejects age 0 or negative numbers
  },
  course: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

// "Student" becomes the collection "students" in MongoDB.
// Mongoose makes the name lowercase and adds an "s" automatically.
module.exports = mongoose.model("Student", studentSchema);
