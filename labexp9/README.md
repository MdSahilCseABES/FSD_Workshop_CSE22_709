# Experiment 9

## Objective

Create a REST API using Express and MongoDB:

- `POST /students` — Add a new student
- `GET /students` — Retrieve all students
- `PUT /students/:id` — Update a student by ID
- `DELETE /students/:id` — Delete a student

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose (connects Express to MongoDB and checks the data shape)

## Folder Structure

```
labexp9/
├── package.json
├── server.js
├── models/
│   └── Student.js
├── routes/
│   └── studentRoutes.js
└── README.md
```

The code is split into three parts so each file has one job:

- **models/Student.js** — what a student looks like
- **routes/studentRoutes.js** — what happens on each route
- **server.js** — starts the app and connects the database

## API Routes

| Method | Route | Purpose | Success | Error |
|--------|-------|---------|---------|-------|
| POST | `/students` | Add a student | 201 | 400 if a field is missing |
| GET | `/students` | Get all students | 200 | 500 |
| GET | `/students/:id` | Get one student | 200 | 404 / 400 |
| PUT | `/students/:id` | Update a student | 200 | 404 / 400 |
| DELETE | `/students/:id` | Delete a student | 200 | 404 / 400 |

## How to Run

Make sure MongoDB is running:

```
brew services start mongodb-community
```

Install the packages:

```
npm install
```

Start the server:

```
npm start
```

Terminal shows:

```
Connected to MongoDB
Server running at http://localhost:3000
```

## How to Test the Output

Keep the server terminal open and use a **second terminal tab**.

### 1. POST — add a student

```
curl -X POST http://localhost:3000/students -H "Content-Type: application/json" -d '{"name":"Sahil","age":21,"course":"CSE","email":"sahil@example.com"}'
```

Status `201`:

```json
{
  "_id": "65c9f1a2b3c4d5e6f7a8b9c0",
  "name": "Sahil",
  "age": 21,
  "course": "CSE",
  "email": "sahil@example.com",
  "__v": 0
}
```

**Copy the `_id` value** — you need it for the PUT and DELETE tests.

Add one more so the list has two students:

```
curl -X POST http://localhost:3000/students -H "Content-Type: application/json" -d '{"name":"Priya","age":20,"course":"IT"}'
```

### 2. GET — retrieve all students

```
curl http://localhost:3000/students
```

Status `200`:

```json
[
  {
    "_id": "65c9f1a2b3c4d5e6f7a8b9c0",
    "name": "Sahil",
    "age": 21,
    "course": "CSE",
    "email": "sahil@example.com",
    "__v": 0
  },
  {
    "_id": "65c9f1a2b3c4d5e6f7a8b9c1",
    "name": "Priya",
    "age": 20,
    "course": "IT",
    "__v": 0
  }
]
```

### 3. PUT — update a student

Replace `<id>` with the real `_id` you copied.

```
curl -X PUT http://localhost:3000/students/<id> -H "Content-Type: application/json" -d '{"age":22,"course":"ECE"}'
```

Status `200`, and the response shows the **new** values:

```json
{
  "_id": "65c9f1a2b3c4d5e6f7a8b9c0",
  "name": "Sahil",
  "age": 22,
  "course": "ECE",
  "email": "sahil@example.com",
  "__v": 0
}
```

### 4. DELETE — delete a student

```
curl -X DELETE http://localhost:3000/students/<id>
```

Status `200`:

```json
{
  "message": "Student deleted successfully",
  "student": { "_id": "65c9f1a2b3c4d5e6f7a8b9c0", "name": "Sahil", "age": 22, "course": "ECE", "__v": 0 }
}
```

Run the GET again and only Priya is left.

### 5. Testing the error cases

Missing a required field gives `400`:

```
curl -X POST http://localhost:3000/students -H "Content-Type: application/json" -d '{"name":"Test"}'
```

```json
{ "message": "Student validation failed: course: Path `course` is required., age: Path `age` is required." }
```

An id that does not exist gives `404`:

```
curl -X DELETE http://localhost:3000/students/65c9f1a2b3c4d5e6f7a8b9ff
```

```json
{ "message": "Student not found" }
```

An id that is not a valid ObjectId gives `400`:

```
curl http://localhost:3000/students/abc
```

```json
{ "message": "Invalid id" }
```

### Checking the database directly

```
mongosh
```

```
use studentDB
db.students.find()
```

## Important points

- **`express.json()`** — without this middleware `req.body` is `undefined` and
  every POST would fail. It replaces the whole manual chunk-collecting code we
  wrote in experiment 5.
- **`express.Router()`** — lets us keep all the `/students` routes in their own
  file. `app.use("/students", studentRoutes)` adds the `/students` prefix, which
  is why the routes inside the file are written as `"/"` and `"/:id"` and not the
  full path.
- **`req.params.id`** — the value from the URL. For `/students/65c9f1...` the
  `:id` part becomes `req.params.id`.
- **`req.body`** vs **`req.params`** — body is the JSON sent with the request,
  params come from the URL itself.
- **Schema validation** — `required: true` in the model is what produces the 400
  error. The database itself would happily store an incomplete document; it is
  mongoose that stops it.
- **`new: true`** in `findByIdAndUpdate` — without it, mongoose returns the
  document as it was **before** the update, which is confusing when testing.
- **`runValidators: true`** — by default mongoose skips schema checks on
  updates. This turns them back on so you cannot PUT an invalid age.
- **async / await with try-catch** — every database call can fail, so each route
  wraps it in `try { } catch { }` and sends a proper status code instead of
  crashing the server.
- **`return` before `res.status(404)`** — stops the function so it does not try
  to send a second response.
- **`__v`** — a version key mongoose adds automatically. It is normal and can be
  ignored.
- **Why connect before listen** — the server only starts after MongoDB connects,
  so we never accept requests we cannot answer.

## Conclusion

This is a complete REST API. Express handles the routing, mongoose handles the
database and the data validation, and the correct HTTP status code is returned
for every case — success as well as failure.
