# Experiment 5

## Objective

Create routes that handle GET, POST, PUT and DELETE in Node.js.

This is done using only the built-in `http` module, so we can see exactly what
work Express does for us in the next experiment.

## Technologies Used

- Node.js
- Built-in `http` module (no npm install needed)

## Routes

| Method | Route | Meaning | Success status |
|--------|-------|---------|----------------|
| GET | `/students` | Get all students | 200 |
| GET | `/students/:id` | Get one student | 200 |
| POST | `/students` | Add a new student | 201 |
| PUT | `/students/:id` | Update a student | 200 |
| DELETE | `/students/:id` | Delete a student | 200 |

Error responses: `400` bad request, `404` not found, `405` method not allowed.

## How to Run

```
node server.js
```

Server starts on **http://localhost:5000**. Keep this terminal open and use a
**second terminal tab** for the curl commands below.

## How to Test the Output

### 1. GET all students

```
curl http://localhost:5000/students
```

```json
[
  { "id": 1, "name": "Sahil", "course": "CSE" },
  { "id": 2, "name": "Rahul", "course": "IT" }
]
```

### 2. GET one student

```
curl http://localhost:5000/students/2
```

```json
{ "id": 2, "name": "Rahul", "course": "IT" }
```

A wrong id gives status 404:

```
curl http://localhost:5000/students/99
```

```json
{ "message": "Student not found" }
```

### 3. POST a new student

```
curl -X POST http://localhost:5000/students -H "Content-Type: application/json" -d '{"name":"Priya","course":"CSE"}'
```

```json
{ "id": 3, "name": "Priya", "course": "CSE" }
```

If a field is missing you get status 400:

```
curl -X POST http://localhost:5000/students -H "Content-Type: application/json" -d '{"name":"Priya"}'
```

```json
{ "message": "name and course required" }
```

### 4. PUT (update) a student

Only the fields you send get changed.

```
curl -X PUT http://localhost:5000/students/1 -H "Content-Type: application/json" -d '{"course":"ECE"}'
```

```json
{ "id": 1, "name": "Sahil", "course": "ECE" }
```

### 5. DELETE a student

```
curl -X DELETE http://localhost:5000/students/2
```

```json
{ "message": "Deleted", "student": { "id": 2, "name": "Rahul", "course": "IT" } }
```

Run `curl http://localhost:5000/students` again to confirm Rahul is gone.

### 6. Wrong method

```
curl -X PATCH http://localhost:5000/students/1
```

```json
{ "message": "PATCH is not allowed here" }
```

## Important points

- **`request.method`** tells us if it is GET, POST, PUT or DELETE. The same URL
  can do different things depending on the method.
- **Reading the URL** — `"/students/2".split("/").filter(Boolean)` gives
  `["students", "2"]`. `filter(Boolean)` throws away the empty strings that
  appear because the URL starts with `/`.
- **Reading the body** — the body does not arrive all at once. It comes in
  chunks, so we listen to the `data` event to collect them and the `end` event
  to know it is finished. Then `JSON.parse()` turns the text into an object.
  Express does all of this with one line: `app.use(express.json())`.
- **Status codes** — `200` OK, `201` created, `400` bad request from the
  client, `404` not found, `405` method not allowed.
- **`return` before `sendJson`** — this stops the function so the code below
  does not also try to send a response. Sending twice causes an error.
- The data is stored in a normal array, so everything resets when the server
  restarts. A real database is used from experiment 7 onwards.

## Conclusion

All four CRUD methods can be handled with the plain `http` module, but we have
to check the method, split the URL, and collect the body ourselves. This is why
Express is used in real projects.
