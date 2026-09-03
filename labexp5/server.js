// Experiment 5
// Routes that handle GET, POST, PUT and DELETE in Node.js
//
// This uses only the built-in http module, no Express.
// So we have to check request.method and request.url ourselves.
// (Express is used in the next experiment and it makes this much shorter.)

const http = require("http");

const port = 5000;

// Our data. It lives in memory, so it resets when the server restarts.
let students = [
  { id: 1, name: "Sahil", course: "CSE" },
  { id: 2, name: "Rahul", course: "IT" },
];

let nextId = 3;

// Small helper so we do not repeat writeHead + end everywhere
function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data, null, 2));
}

// The body of a POST or PUT request arrives in pieces called chunks.
// We collect all the chunks, join them, then convert the text to an object.
function readBody(request, callback) {
  let body = "";

  request.on("data", function (chunk) {
    body += chunk;
  });

  request.on("end", function () {
    try {
      callback(null, JSON.parse(body));
    } catch (err) {
      callback(err, null);
    }
  });
}

const server = http.createServer(function (request, response) {
  const method = request.method;
  const url = request.url;

  console.log(method + " " + url);

  // url looks like "/students" or "/students/2"
  const parts = url.split("/").filter(Boolean); // removes empty strings
  const resource = parts[0]; // "students"
  const id = parts[1] ? Number(parts[1]) : null; // 2 or null

  if (resource !== "students") {
    return sendJson(response, 404, { message: "Route not found" });
  }

  // ---------- GET ----------
  if (method === "GET") {
    if (id === null) {
      // GET /students  -> send the whole list
      return sendJson(response, 200, students);
    }

    // GET /students/2 -> send one student
    const student = students.find(function (s) {
      return s.id === id;
    });

    if (!student) {
      return sendJson(response, 404, { message: "Student not found" });
    }
    return sendJson(response, 200, student);
  }

  // ---------- POST ----------
  if (method === "POST") {
    return readBody(request, function (err, body) {
      if (err) {
        return sendJson(response, 400, { message: "Invalid JSON" });
      }
      if (!body.name || !body.course) {
        return sendJson(response, 400, { message: "name and course required" });
      }

      const newStudent = { id: nextId, name: body.name, course: body.course };
      nextId = nextId + 1;
      students.push(newStudent);

      // 201 means "created"
      return sendJson(response, 201, newStudent);
    });
  }

  // ---------- PUT ----------
  if (method === "PUT") {
    if (id === null) {
      return sendJson(response, 400, { message: "Please give an id in the url" });
    }

    return readBody(request, function (err, body) {
      if (err) {
        return sendJson(response, 400, { message: "Invalid JSON" });
      }

      const student = students.find(function (s) {
        return s.id === id;
      });

      if (!student) {
        return sendJson(response, 404, { message: "Student not found" });
      }

      // Only change the fields that were actually sent
      if (body.name) {
        student.name = body.name;
      }
      if (body.course) {
        student.course = body.course;
      }

      return sendJson(response, 200, student);
    });
  }

  // ---------- DELETE ----------
  if (method === "DELETE") {
    if (id === null) {
      return sendJson(response, 400, { message: "Please give an id in the url" });
    }

    const index = students.findIndex(function (s) {
      return s.id === id;
    });

    if (index === -1) {
      return sendJson(response, 404, { message: "Student not found" });
    }

    const removed = students.splice(index, 1)[0];
    return sendJson(response, 200, { message: "Deleted", student: removed });
  }

  // Any other method like PATCH
  return sendJson(response, 405, { message: method + " is not allowed here" });
});

server.listen(port, function () {
  console.log("Server running at http://localhost:" + port);
  console.log("Routes:");
  console.log("  GET    /students      -> all students");
  console.log("  GET    /students/:id  -> one student");
  console.log("  POST   /students      -> add a student");
  console.log("  PUT    /students/:id  -> update a student");
  console.log("  DELETE /students/:id  -> remove a student");
  console.log("\nPress Ctrl + C to stop.");
});
