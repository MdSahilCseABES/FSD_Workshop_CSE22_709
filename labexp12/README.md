# Experiment 12 (Value Added)

## Objective

Create a Student Management System (SMS) application using React, Express and
MongoDB, then Dockerize it and deploy it on Render.

## Technologies Used

**Frontend**

- React 18 (with hooks: `useState`, `useEffect`)
- Vite (dev server and build tool)
- Plain CSS

**Backend**

- Node.js and Express.js
- MongoDB with Mongoose
- cors

**Deployment**

- Docker and Docker Compose
- MongoDB Atlas (cloud database)
- Render (free hosting)

## Folder Structure

```
labexp12/
├── docker-compose.yml      <- runs all three parts together
├── README.md
│
├── backend/
│   ├── package.json
│   ├── server.js           <- starts Express, connects MongoDB
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── models/
│   │   └── Student.js      <- the student schema
│   └── routes/
│       └── studentRoutes.js
│
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── Dockerfile
    ├── .dockerignore
    └── src/
        ├── main.jsx        <- entry point
        ├── App.jsx         <- holds the data, talks to the backend
        ├── StudentForm.jsx <- add / edit form
        ├── StudentList.jsx <- the table
        └── index.css
```

## Features

- Add a student
- View all students in a table
- Edit a student (the form fills in with the existing values)
- Delete a student (with a confirm box)
- Duplicate roll numbers are rejected with a clear message
- Required fields are checked on both the form and the server

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/students` | List all students |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

---

## PART A — Running it locally

MongoDB must be running:

```
brew services start mongodb-community
```

### Terminal 1 — backend

```
cd backend
```

```
npm install
```

```
npm start
```

Shows:

```
Connected to MongoDB
Backend running on port 5000
```

### Terminal 2 — frontend

```
cd frontend
```

```
npm install
```

```
npm run dev
```

Shows:

```
  VITE v5.1.0  ready in 320 ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in the browser.

**Both terminals must stay open.** The frontend on 5173 and the backend on 5000
are two separate programs.

### How to test the output

1. The page opens with the heading **Student Management System** and the message
   *"No students yet. Add one using the form above."*
2. Fill the form — Name `Sahil`, Roll No `709`, Course `CSE`, Age `21` — and
   click **Add Student**. A blue bar shows **Student added** and the row appears
   in the table with the count showing `Student List (1)`.
3. Add a second student, e.g. `Priya`, `710`, `IT`, `20`.
4. Click **Edit** on Sahil's row. The form heading changes to **Edit Student**
   and the boxes fill with his values. Change the course to `ECE` and click
   **Update Student**. The table row updates.
5. Click **Cancel** while editing — the form clears and goes back to add mode.
6. Try adding a student with roll number `709` again. You get
   **This roll number already exists** and nothing is added.
7. Click **Delete** on a row, confirm the box, and the row disappears.
8. Refresh the page. The students are still there, because they are in MongoDB
   and not just in React state.

Check the data directly in the database:

```
mongosh
```

```
use smsDB
db.students.find()
```

---

## PART B — Running it with Docker

Docker Desktop must be running. This starts the database, backend and frontend
together with one command.

```
docker compose up --build
```

Then open **http://localhost:3000** (not 5173 — nginx serves the built app on
port 3000 here).

Stop everything:

```
docker compose down
```

Stop and also delete the database data:

```
docker compose down -v
```

Check all three containers are up:

```
docker ps
```

```
CONTAINER ID   IMAGE               STATUS         PORTS                      NAMES
aaa111         labexp12-frontend   Up 1 minute    0.0.0.0:3000->80/tcp       sms-frontend
bbb222         labexp12-backend    Up 1 minute    0.0.0.0:5000->5000/tcp     sms-backend
ccc333         mongo:7             Up 1 minute    0.0.0.0:27017->27017/tcp   sms-mongo
```

---

## PART C — Deploying on Render

Render does not host databases for MongoDB, so the database goes on MongoDB
Atlas and the two app parts go on Render.

### Step 1 — Create the database on MongoDB Atlas

1. Sign up at https://cloud.mongodb.com
2. Create a **free M0 cluster**
3. **Database Access** → Add New Database User → note the username and password
4. **Network Access** → Add IP Address → **Allow Access from Anywhere**
   (`0.0.0.0/0`). Render's servers change IP, so a fixed IP will not work.
5. **Connect** → **Drivers** → copy the connection string. It looks like:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smsDB
```

Replace `<password>` in that string with the real password, and add `/smsDB`
before the `?` so it uses our database name.

### Step 2 — Push the code to GitHub

Render deploys from GitHub, so the code must be pushed first (see labexp10).

```
git add .
```

```
git commit -m "Added labexp12"
```

```
git push origin main
```

### Step 3 — Deploy the backend

1. Sign up at https://render.com with your GitHub account
2. **New +** → **Web Service** → pick the `FSD_Workshop_CSE22_709` repository
3. Fill in:

   | Setting | Value |
   |---------|-------|
   | Name | `sms-backend` |
   | Root Directory | `labexp12/backend` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `node server.js` |
   | Instance Type | Free |

4. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `MONGO_URL` | your Atlas connection string |

   Do **not** set `PORT` — Render sets it automatically, and `server.js`
   already reads `process.env.PORT`.

5. Click **Create Web Service** and wait for the log to say
   `Connected to MongoDB`.
6. Copy the URL Render gives you, for example
   `https://sms-backend.onrender.com`. Open it in the browser — you should see
   `{"message":"Student Management System API is running"}`.

### Step 4 — Deploy the frontend

1. **New +** → **Static Site** → same repository
2. Fill in:

   | Setting | Value |
   |---------|-------|
   | Name | `sms-frontend` |
   | Root Directory | `labexp12/frontend` |
   | Build Command | `npm install && npm run build` |
   | Publish Directory | `dist` |

3. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://sms-backend.onrender.com` |

   Use your real backend URL, with **no** trailing slash.

4. Click **Create Static Site**.

### Step 5 — Test the deployed app

Open the frontend URL Render gives you, e.g.
`https://sms-frontend.onrender.com`. Add a student and refresh — it should
persist. Check MongoDB Atlas → **Browse Collections** and the student will be
there.

The first request after some idle time takes 30–50 seconds, because free Render
services go to sleep. This is normal, not a bug in the code.

---

## Explanation of the important parts

### React hooks

- **`useState`** — gives a component a value it can remember and change.
  `const [students, setStudents] = useState([])` creates the list plus the
  function to replace it. You must use `setStudents(...)`; changing `students`
  directly does not redraw the page.
- **`useEffect(fn, [])`** — runs code after the component appears on screen. The
  empty `[]` means "run only once". This is how we load the students when the
  page opens. **Without the `[]`, it runs after every render and creates an
  endless loop of fetch requests.**
- **`useEffect(fn, [editingStudent])`** — in `StudentForm`, this runs again every
  time `editingStudent` changes, which is what fills the boxes when you click
  Edit.

### Components and props

The app is split into three components so each has one job: `App` owns the data,
`StudentForm` collects input, `StudentList` displays rows.

Data is passed down through **props** (`students`, `onEdit`, `onDelete`).
Children never change the data themselves — they call a function the parent gave
them. This is why all the `fetch` calls live in `App.jsx` only.

### One handleChange for every input

```js
setForm({ ...form, [event.target.name]: event.target.value });
```

`...form` copies the existing values, then `[event.target.name]` overwrites just
the one field that changed. The `name` on each `<input>` is what makes this work,
so one function handles all five boxes instead of five separate functions.

### `event.preventDefault()`

A browser form reloads the whole page when submitted, which would wipe the React
state. `preventDefault()` stops that so React can handle the submit itself.

### The `key` prop in the table

`key={student._id}` tells React which row is which. Without it React warns in the
console and can show the wrong row after a delete.

### Why cors() is needed

The frontend is on port 5173 and the backend on port 5000. Browsers block
requests between different origins by default. `app.use(cors())` adds the header
that permits it. Remove that one line and every fetch fails with a CORS error in
the console.

### Why `Number(form.age)`

An `<input>` always gives back **text**, even with `type="number"`. So `"21"`
would be sent instead of `21`, and the mongoose schema expects a Number.

### `response.ok`

`fetch` does **not** throw an error for status 400 or 404 — it only throws when
the network itself fails. So we check `response.ok` (true for 200–299) to catch
things like the duplicate roll number.

### Error code 11000

MongoDB's duplicate-key error. Because `rollNo` is marked `unique: true` in the
schema, inserting the same roll number twice produces this code. We catch it and
send a readable message instead of a raw database error.

### `import.meta.env.VITE_API_URL`

Vite only exposes variables that start with `VITE_`. Vite replaces this value at
**build** time, not at run time. That is why the frontend Dockerfile takes it as
an `ARG` before `npm run build`, and why Render needs it set before the build.

### The two-stage frontend Dockerfile

Stage 1 has Node and builds the React app into plain files. Stage 2 copies only
those files into nginx. The final image has no Node.js and no `node_modules`, so
it is a few MB instead of a few hundred.

### Why `localhost` in docker-compose, not `backend`

In `docker-compose.yml` the backend uses `mongodb://mongo:27017`, but the
frontend uses `http://localhost:5000`. The difference is **who makes the
request**. The backend calls MongoDB from inside Docker, where service names
work. The frontend's API URL is used by the browser on your Mac, and your
browser cannot resolve Docker service names.

## Troubleshooting

| Problem | Cause and fix |
|---------|---------------|
| Table stays empty, console shows a CORS error | `cors()` missing, or the backend is not running |
| "Could not reach the server" | Backend terminal is closed. Start it in Terminal 1 |
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB is not running — `brew services start mongodb-community` |
| Endless network requests in the console | `[]` missing from `useEffect` |
| Frontend on Render calls localhost | `VITE_API_URL` was not set before the build. Set it and redeploy |
| Atlas connection times out on Render | Network Access is not set to `0.0.0.0/0` |
| First load on Render takes ~50 s | Free tier sleeps when idle. Normal |

## Conclusion

This is a complete MERN-style full stack application. React handles the user
interface, Express provides the REST API, and MongoDB stores the data. Docker
lets all three run with one command locally, and the same code deploys to Render
with MongoDB Atlas as the cloud database.
