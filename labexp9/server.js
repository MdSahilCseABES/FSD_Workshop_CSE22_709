// Experiment 9
// REST API using Express and MongoDB
//
//   POST   /students      -> Add a new student
//   GET    /students      -> Retrieve all students
//   PUT    /students/:id  -> Update a student by ID
//   DELETE /students/:id  -> Delete a student

const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const port = 3000;

// Change this to your Atlas connection string if you are not using a local MongoDB
const mongoUrl = "mongodb://127.0.0.1:27017/studentDB";

// This one line reads the JSON body of a request and puts it in req.body.
// Without it, req.body would be undefined.
app.use(express.json());

// Every route inside studentRoutes now starts with /students
app.use("/students", studentRoutes);

// A simple home route so we know the server is alive
app.get("/", function (req, res) {
  res.json({
    message: "Student REST API is running",
    routes: [
      "POST   /students",
      "GET    /students",
      "GET    /students/:id",
      "PUT    /students/:id",
      "DELETE /students/:id",
    ],
  });
});

// Connect to MongoDB first, and start the server only if it worked.
// There is no point serving requests if the database is unreachable.
mongoose
  .connect(mongoUrl)
  .then(function () {
    console.log("Connected to MongoDB");

    app.listen(port, function () {
      console.log("Server running at http://localhost:" + port);
      console.log("Press Ctrl + C to stop.");
    });
  })
  .catch(function (err) {
    console.log("Could not connect to MongoDB:", err.message);
    console.log("Start MongoDB with: brew services start mongodb-community");
  });
