// Experiment 12 - Backend
// Student Management System API

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/smsDB";

// The React app runs on a different port (5173), and browsers block requests
// between different ports unless the server allows it. cors() adds the header
// that allows it. Without this line every fetch from React fails.
app.use(cors());

app.use(express.json());

app.use("/api/students", studentRoutes);

// A health route so we can quickly check the server is alive,
// which is also useful on Render after deploying.
app.get("/", function (req, res) {
  res.json({ message: "Student Management System API is running" });
});

mongoose
  .connect(mongoUrl)
  .then(function () {
    console.log("Connected to MongoDB");
    app.listen(port, "0.0.0.0", function () {
      console.log("Backend running on port " + port);
    });
  })
  .catch(function (err) {
    console.log("Could not connect to MongoDB:", err.message);
  });
