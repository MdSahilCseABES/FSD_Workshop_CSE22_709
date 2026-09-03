// Experiment 3
// Basic HTTP server using http.createServer()
// It responds with "Hello World" and also returns headers + status code.

const http = require("http");

const port = 3000;

// createServer takes a function that runs on every request.
// request  -> what the browser sent us
// response -> what we send back
const server = http.createServer(function (request, response) {
  // Print the request details in the terminal so we can see them
  console.log("Request received:", request.method, request.url);

  if (request.url === "/") {
    // 200 means OK. The second argument is the set of response headers.
    response.writeHead(200, {
      "Content-Type": "text/plain",
      "X-Student-Name": "Sahil",
      "X-Roll-No": "709",
    });
    response.end("Hello World");
  } else if (request.url === "/info") {
    // Sending JSON back instead of plain text
    response.writeHead(200, { "Content-Type": "application/json" });

    const info = {
      method: request.method,
      url: request.url,
      statusCode: 200,
      requestHeaders: request.headers,
    };

    // JSON.stringify turns the object into text so it can be sent
    response.end(JSON.stringify(info, null, 2));
  } else if (request.url === "/html") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end("<h1>Hello World</h1><p>This page is sent as HTML.</p>");
  } else {
    // 404 means the page was not found
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("404 - Page Not Found");
  }
});

// listen() starts the server and keeps it running
server.listen(port, function () {
  console.log("Server is running at http://localhost:" + port);
  console.log("Try these routes:");
  console.log("  http://localhost:" + port + "/       -> Hello World");
  console.log("  http://localhost:" + port + "/info   -> JSON with headers");
  console.log("  http://localhost:" + port + "/html   -> HTML page");
  console.log("  http://localhost:" + port + "/abc    -> 404 error");
  console.log("\nPress Ctrl + C to stop the server.");
});
