// Experiment 6
// A simple Express.js server that serves HTML files using the fs module.
// Routes: /         ->  home.html
//         /about    ->  about.html
//         /contact  ->  contact.html
//
// Note: Express has res.sendFile() which is shorter, but this experiment
// asks us to use fs, so we read the file ourselves and send the text.

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// __dirname is the folder this file is in.
// path.join builds a correct path on any operating system.
function sendHtmlFile(fileName, response, statusCode) {
  const filePath = path.join(__dirname, "public", fileName);

  fs.readFile(filePath, "utf8", function (err, htmlData) {
    if (err) {
      console.log("Could not read " + fileName + ":", err.message);
      response.writeHead(500, { "Content-Type": "text/html" });
      response.end("<h1>500 - Server Error</h1>");
      return;
    }

    // Tell the browser this is HTML so it renders the tags
    response.writeHead(statusCode, { "Content-Type": "text/html" });
    response.end(htmlData);
  });
}

// ---------- ROUTES ----------

app.get("/", function (req, res) {
  sendHtmlFile("home.html", res, 200);
});

app.get("/about", function (req, res) {
  sendHtmlFile("about.html", res, 200);
});

app.get("/contact", function (req, res) {
  sendHtmlFile("contact.html", res, 200);
});

// This runs only if none of the routes above matched, so it is our 404 page.
// The status is 404 and not 200, because the page really was not found.
app.use(function (req, res) {
  sendHtmlFile("404.html", res, 404);
});

app.listen(port, function () {
  console.log("Server running at http://localhost:" + port);
  console.log("Pages:");
  console.log("  http://localhost:" + port + "/");
  console.log("  http://localhost:" + port + "/about");
  console.log("  http://localhost:" + port + "/contact");
  console.log("\nPress Ctrl + C to stop.");
});
