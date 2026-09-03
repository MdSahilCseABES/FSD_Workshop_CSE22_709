// Experiment 11
// Same REST API as experiment 9, but ready to run inside Docker.
//
// The only real change is the database URL. Inside Docker, "127.0.0.1"
// means "this container", not "my Mac". So the app would look for MongoDB
// inside its own container and fail. Instead we read the URL from an
// environment variable, and docker-compose passes in the container name.

const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// process.env holds the environment variables.
// The value after || is used when the variable is not set, so the app
// still works normally with "npm start" outside Docker.
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/studentDB";

app.use(express.json());
app.use("/students", studentRoutes);

app.get("/", function (req, res) {
  res.json({
    message: "Student REST API running inside Docker",
    database: mongoUrl,
  });
});

mongoose
  .connect(mongoUrl)
  .then(function () {
    console.log("Connected to MongoDB at", mongoUrl);

    // 0.0.0.0 means "accept connections from outside this container".
    // The default only accepts connections from inside the container,
    // so the browser on your Mac would not be able to reach it.
    app.listen(port, "0.0.0.0", function () {
      console.log("Server running on port " + port);
    });
  })
  .catch(function (err) {
    console.log("Could not connect to MongoDB:", err.message);
  });
