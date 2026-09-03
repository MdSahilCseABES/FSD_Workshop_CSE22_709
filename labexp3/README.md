# Experiment 3

## Objective

Create a basic HTTP server using `http.createServer()`. Respond with
"Hello World" and return headers along with a status code.

## Technologies Used

- Node.js
- Built-in `http` module (no npm install needed)

## Routes in this server

| Route | Status | Content-Type | Response |
|-------|--------|--------------|----------|
| `/` | 200 | text/plain | `Hello World` (with custom headers) |
| `/info` | 200 | application/json | Request details as JSON |
| `/html` | 200 | text/html | An HTML heading |
| anything else | 404 | text/plain | `404 - Page Not Found` |

## How to Run

```
node server.js
```

The terminal will show:

```
Server is running at http://localhost:3000
```

Keep this terminal open. The server keeps running until you stop it with
**Ctrl + C**.

## How to Test the Output

**Option 1 - Browser**

Open these one by one:

- http://localhost:3000/
- http://localhost:3000/info
- http://localhost:3000/html
- http://localhost:3000/abc

**Option 2 - Terminal (open a second terminal tab)**

`-i` shows the response headers and the status line together.

```
curl -i http://localhost:3000/
```

To see only the status code of the 404 route:

```
curl -o /dev/null -w "%{http_code}\n" http://localhost:3000/abc
```

## Expected Output

**GET /** — status `200`

```
HTTP/1.1 200 OK
Content-Type: text/plain
X-Student-Name: Sahil
X-Roll-No: 709

Hello World
```

**GET /html** — status `200`

```
<h1>Hello World</h1><p>This page is sent as HTML.</p>
```

**GET /abc** — status `404`

```
404 - Page Not Found
```

**GET /info** — status `200`

```json
{
  "method": "GET",
  "url": "/info",
  "statusCode": 200,
  "requestHeaders": {
    "host": "localhost:3000",
    "user-agent": "curl/8.7.1"
  }
}
```

The server terminal also prints one line per request, for example:

```
Request received: GET /
```

## Important points

- `http.createServer(callback)` — the callback runs on **every** request.
- `response.writeHead(statusCode, headersObject)` — sets the status code and
  the response headers. It must be called **before** `response.end()`.
- `response.end(data)` — sends the body and closes the connection. If you
  forget `end()`, the browser keeps loading forever.
- `Content-Type` tells the browser how to treat the response. With
  `text/plain` the browser shows the tags as text; with `text/html` it
  actually renders them.
- Custom headers usually start with `X-`, like `X-Student-Name`.

## Conclusion

A working web server can be made in Node.js without any external package.
The `http` module gives us the request and response objects, and we decide
what to send back based on `request.url`.
