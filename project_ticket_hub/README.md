# TicketFlow - Event-Driven Campus Helpdesk & Audit Hub

A clean, modular, and easy-to-understand Full-Stack Node.js project built **strictly using concepts and technologies from Lab Experiments 1, 2, 3, and 5**.

- **Student Name:** MD Sahil
- **Roll No:** CSE22 / 709
- **Course:** Full Stack Development Workshop
- **Zero NPM Dependencies:** Runs 100% on pure Node.js built-in modules (`http`, `events`, `fs`, `url`, `path`).

---

## 🌟 How the 4 Labs are Integrated

| Lab Experiment | Concept Used | Where in Code | What it Does |
|---|---|---|---|
| **Lab Exp 1** | `EventEmitter` & Event Loop | `eventManager.js` | Custom `TicketEventEmitter` dispatches domain events (`ticket:created`, `ticket:urgent`, `ticket:updated`, `ticket:deleted`). Demonstrates `process.nextTick` for microtask audit logging and `setImmediate` for non-blocking asynchronous alerts. |
| **Lab Exp 2** | `fs` File CRUD Operations | `fileStorage.js` | Uses `fs.readFileSync` & `fs.writeFileSync` to persist tickets in `data/tickets.json`, `fs.appendFileSync` for audit logging (`data/audit.log`), and `fs.unlinkSync` for resetting logs. |
| **Lab Exp 3** | `http.createServer()` | `server.js` | Built-in HTTP server returning custom headers (`X-Student-Name`, `X-Roll-No`, `X-Powered-By`), handling multiple content types (`text/html`, `application/json`, `text/plain`), and status codes. |
| **Lab Exp 5** | REST API HTTP Routing | `server.js` | Pure Node.js request router handling `GET`, `POST`, `PUT`, and `DELETE` on `/tickets` with stream-based JSON body parsing and status codes (`200`, `201`, `400`, `404`, `405`). |

---

## 📁 Project Structure

```
project_ticket_hub/
├── data/
│   ├── tickets.json          # Lab 2: Persistent file storage for tickets
│   └── audit.log             # Lab 2: Append-only audit history log
├── eventManager.js           # Lab 1: Custom EventEmitter & Event Loop hooks
├── fileStorage.js            # Lab 2: fs module CRUD operations
├── server.js                 # Lab 3 & 5: Pure HTTP Server & REST router
├── package.json              # Project configuration (zero external dependencies)
└── README.md                 # Complete documentation and viva guide
```

---

## 🚀 How to Run

1. Open terminal inside the project directory:
   ```bash
   cd project_ticket_hub
   ```

2. Start the server (no `npm install` needed!):
   ```bash
   node server.js
   ```

3. The server starts at:
   - **Interactive Web Dashboard:** [http://localhost:4500](http://localhost:4500)
   - **REST API (All Tickets):** [http://localhost:4500/tickets](http://localhost:4500/tickets)
   - **Live File Audit Log:** [http://localhost:4500/audit](http://localhost:4500/audit)

---

## 🧪 Testing the APIs (Lab 5 & 3)

Open a second terminal window to test using `curl`:

### 1. GET all tickets
```bash
curl -i http://localhost:4500/tickets
```
*(Notice the custom response headers from Lab 3: `X-Student-Name: MD Sahil`, `X-Roll-No: CSE22-709`!)*

### 2. GET a single ticket by ID
```bash
curl http://localhost:4500/tickets/1
```

### 3. POST a new ticket
```bash
curl -X POST http://localhost:4500/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Lab 3 projector not turning on","category":"Hardware","priority":"High","createdBy":"Sahil"}'
```
*(Notice in the server terminal: Lab 1 `ticket:urgent` event fires and schedules an asynchronous notification via `setImmediate`!)*

### 4. PUT (update) a ticket
```bash
curl -X PUT http://localhost:4500/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"Closed"}'
```

### 5. DELETE a ticket
```bash
curl -X DELETE http://localhost:4500/tickets/2
```

### 6. View the File Audit Log (Lab 2 `fs` demo)
```bash
curl http://localhost:4500/audit
```

---

## 🎓 Viva Questions & Answers (For Lab Exams)

**Q1: Why does this project need zero external NPM packages?**
> **Ans:** All functionality is implemented using Node.js core modules: `http` for creating the server and routing (Labs 3 & 5), `fs` for file-based database persistence (Lab 2), and `events` for event emission and event loop demonstration (Lab 1).

**Q2: How does the file persistence work without a database like MongoDB?**
> **Ans:** We used Node's built-in `fs` module (Lab 2). Tickets are saved and read as JSON via `fs.writeFileSync()` and `fs.readFileSync()`, while every state change is permanently appended to `data/audit.log` via `fs.appendFileSync()`.

**Q3: How is the event loop (Lab 1) utilized?**
> **Ans:** `process.nextTick` guarantees that audit logging happens in the microtask phase right after the event emits. `setImmediate` dispatches simulated notifications (like technician email/SMS alerts) during the check phase, ensuring the HTTP response is never blocked.

**Q4: How does Lab 5 routing work without Express?**
> **Ans:** The server reads `req.method` (`GET`, `POST`, `PUT`, `DELETE`) and parses `req.url` using the `url` module. Request bodies are received asynchronously in data stream chunks (`req.on("data")` and `req.on("end")`) and parsed with `JSON.parse()`.
