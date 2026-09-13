// =============================================================================
// Project 1: TicketFlow - Campus Helpdesk & Audit Hub
// Student: MD Sahil | Roll No: CSE22 / 709
//
// Integrated strictly using Lab Experiments 1, 2, 3, and 5:
// - Lab 1: Custom EventEmitter, DOM-like lifecycle events & Event Loop (nextTick, setImmediate)
// - Lab 2: File CRUD operations using the built-in 'fs' module
// - Lab 3: Basic HTTP server using http.createServer() with custom headers & Content-Types
// - Lab 5: Pure Node.js REST routing handling GET, POST, PUT, DELETE with body streams
// =============================================================================

const http = require("http");
const url = require("url");
const fileStorage = require("./fileStorage");
const eventBus = require("./eventManager");

const PORT = 4500;

// Helper: send JSON response with standard and custom headers (Lab 3 & 5)
function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
    "X-Powered-By": "Node.js-HTTP-Lab3",
    "X-Student-Name": "MD Sahil",
    "X-Roll-No": "CSE22-709"
  });
  res.end(payload);
}

// Helper: send HTML response (Lab 3)
function sendHtml(res, statusCode, htmlContent) {
  res.writeHead(statusCode, {
    "Content-Type": "text/html",
    "X-Powered-By": "Node.js-HTTP-Lab3",
    "X-Student-Name": "MD Sahil"
  });
  res.end(htmlContent);
}

// Helper: send Plain Text response (Lab 3)
function sendText(res, statusCode, textContent) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain",
    "X-Powered-By": "Node.js-HTTP-Lab3"
  });
  res.end(textContent);
}

// Helper: collect request body stream (Lab 5)
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";
    req.on("data", chunk => {
      rawBody += chunk.toString();
    });
    req.on("end", () => {
      if (!rawBody.trim()) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(rawBody);
        resolve(parsed);
      } catch (err) {
        reject(new Error("Malformed JSON in request body"));
      }
    });
    req.on("error", err => reject(err));
  });
}

// =============================================================================
// HTTP SERVER CREATION (Lab Experiment 3)
// =============================================================================
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const segments = pathname.split("/").filter(Boolean); // e.g., ["tickets", "1"]
  const method = req.method.toUpperCase();

  console.log(`[HTTP ${method}] ${pathname}`);

  // ---------------------------------------------------------------------------
  // ROUTE 1: Home Dashboard Page (Lab 3: text/html response)
  // ---------------------------------------------------------------------------
  if (pathname === "/" && method === "GET") {
    const tickets = fileStorage.loadTickets();
    const openCount = tickets.filter(t => t.status.toLowerCase() === "open").length;
    const highCount = tickets.filter(t => t.priority.toLowerCase() === "high").length;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>TicketFlow - Campus Helpdesk</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; }
          .container { max-width: 900px; margin: 0 auto; }
          header { background: #1e293b; padding: 24px; border-radius: 12px; border-left: 6px solid #38bdf8; margin-bottom: 24px; }
          h1 { margin: 0 0 8px 0; color: #38bdf8; font-size: 26px; }
          .meta { color: #94a3b8; font-size: 14px; margin-bottom: 12px; }
          .badges { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
          .badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
          .b1 { background: #0284c7; color: white; }
          .b2 { background: #16a34a; color: white; }
          .b3 { background: #d97706; color: white; }
          .b5 { background: #dc2626; color: white; }
          .stats-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
          .stat-card { background: #1e293b; padding: 18px; border-radius: 10px; text-align: center; }
          .stat-num { font-size: 28px; font-weight: bold; color: #38bdf8; }
          .stat-label { font-size: 13px; color: #94a3b8; text-transform: uppercase; margin-top: 4px; }
          .card { background: #1e293b; padding: 20px; border-radius: 10px; margin-bottom: 16px; }
          h2 { margin-top: 0; font-size: 18px; color: #e2e8f0; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #334155; font-size: 14px; }
          th { color: #94a3b8; }
          .p-High { color: #ef4444; font-weight: bold; }
          .p-Medium { color: #f59e0b; }
          .p-Low { color: #10b981; }
          .links { margin-top: 18px; display: flex; gap: 12px; }
          .btn { background: #38bdf8; color: #0f172a; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; }
          .btn:hover { background: #7dd3fc; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>🎫 TicketFlow - Campus Helpdesk & Audit Hub</h1>
            <div class="meta">Built with pure Node.js (Zero NPM Dependencies) | MD Sahil (CSE22 / 709)</div>
            <div class="badges">
              <span class="badge b1">Lab 1: EventEmitter & EventLoop</span>
              <span class="badge b2">Lab 2: fs File CRUD</span>
              <span class="badge b3">Lab 3: http.createServer()</span>
              <span class="badge b5">Lab 5: REST GET/POST/PUT/DELETE</span>
            </div>
          </header>

          <div class="stats-bar">
            <div class="stat-card">
              <div class="stat-num">${tickets.length}</div>
              <div class="stat-label">Total Tickets</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">${openCount}</div>
              <div class="stat-label">Open Issues</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">${highCount}</div>
              <div class="stat-label">Urgent Priority</div>
            </div>
          </div>

          <div class="card">
            <h2>Current Tickets in Storage (Lab 2: data/tickets.json)</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                ${tickets.map(t => `
                  <tr>
                    <td>#${t.id}</td>
                    <td>${t.title}</td>
                    <td>${t.category}</td>
                    <td class="p-${t.priority}">${t.priority}</td>
                    <td>${t.status}</td>
                    <td>${t.createdBy}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <div class="links">
              <a href="/tickets" class="btn" target="_blank">View JSON API (/tickets)</a>
              <a href="/audit" class="btn" target="_blank">View File Audit Log (/audit)</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    return sendHtml(res, 200, html);
  }

  // ---------------------------------------------------------------------------
  // ROUTE 2: GET & DELETE /audit (Lab 2 fs inspection & reset)
  // ---------------------------------------------------------------------------
  if (pathname === "/audit") {
    if (method === "GET") {
      const logData = fileStorage.getAuditLog();
      return sendText(res, 200, logData);
    }
    if (method === "DELETE") {
      const result = fileStorage.resetAuditLog();
      return sendJson(res, 200, result);
    }
    return sendJson(res, 405, { message: `${method} is not allowed on /audit` });
  }

  // ---------------------------------------------------------------------------
  // ROUTE 3: REST CRUD /tickets and /tickets/:id (Lab Experiment 5)
  // ---------------------------------------------------------------------------
  if (segments[0] === "tickets") {
    const ticketId = segments[1] ? parseInt(segments[1], 10) : null;

    // 1. GET /tickets - Fetch all tickets (optional query ?priority= & ?status=)
    if (method === "GET" && !ticketId) {
      let tickets = fileStorage.loadTickets();
      if (parsedUrl.query.status) {
        tickets = tickets.filter(t => t.status.toLowerCase() === parsedUrl.query.status.toLowerCase());
      }
      if (parsedUrl.query.priority) {
        tickets = tickets.filter(t => t.priority.toLowerCase() === parsedUrl.query.priority.toLowerCase());
      }
      return sendJson(res, 200, tickets);
    }

    // 2. GET /tickets/:id - Fetch single ticket by ID
    if (method === "GET" && ticketId) {
      const tickets = fileStorage.loadTickets();
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) {
        return sendJson(res, 404, { message: `Ticket #${ticketId} not found` });
      }
      return sendJson(res, 200, ticket);
    }

    // 3. POST /tickets - Create a new ticket
    if (method === "POST" && !ticketId) {
      try {
        const body = await parseBody(req);
        if (!body.title || !body.createdBy) {
          return sendJson(res, 400, { message: "Both 'title' and 'createdBy' are required fields" });
        }

        const tickets = fileStorage.loadTickets();
        const nextId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;

        const newTicket = {
          id: nextId,
          title: body.title,
          category: body.category || "General",
          priority: body.priority || "Medium",
          status: "Open",
          createdBy: body.createdBy,
          createdAt: new Date().toISOString()
        };

        tickets.push(newTicket);
        fileStorage.saveTickets(tickets); // Lab 2: fs.writeFileSync

        // Lab 1: Trigger domain events
        eventBus.emit("ticket:created", newTicket);

        return sendJson(res, 201, {
          message: "Ticket created successfully",
          ticket: newTicket
        });
      } catch (err) {
        return sendJson(res, 400, { message: err.message });
      }
    }

    // 4. PUT /tickets/:id - Update an existing ticket
    if (method === "PUT" && ticketId) {
      try {
        const body = await parseBody(req);
        const tickets = fileStorage.loadTickets();
        const ticket = tickets.find(t => t.id === ticketId);

        if (!ticket) {
          return sendJson(res, 404, { message: `Ticket #${ticketId} not found` });
        }

        const previousStatus = ticket.status;
        if (body.title) ticket.title = body.title;
        if (body.category) ticket.category = body.category;
        if (body.priority) ticket.priority = body.priority;
        if (body.status) ticket.status = body.status;

        fileStorage.saveTickets(tickets); // Lab 2: fs.writeFileSync

        // Lab 1: Trigger domain events
        eventBus.emit("ticket:updated", {
          id: ticket.id,
          changes: { previousStatus, updated: body }
        });

        return sendJson(res, 200, {
          message: `Ticket #${ticketId} updated successfully`,
          ticket
        });
      } catch (err) {
        return sendJson(res, 400, { message: err.message });
      }
    }

    // 5. DELETE /tickets/:id - Remove a ticket
    if (method === "DELETE" && ticketId) {
      let tickets = fileStorage.loadTickets();
      const index = tickets.findIndex(t => t.id === ticketId);

      if (index === -1) {
        return sendJson(res, 404, { message: `Ticket #${ticketId} not found` });
      }

      const [deletedTicket] = tickets.splice(index, 1);
      fileStorage.saveTickets(tickets); // Lab 2: fs.writeFileSync

      // Lab 1: Trigger domain events
      eventBus.emit("ticket:deleted", deletedTicket);

      return sendJson(res, 200, {
        message: `Ticket #${ticketId} deleted successfully`,
        deleted: deletedTicket
      });
    }

    // Unhandled method on /tickets
    return sendJson(res, 405, { message: `Method ${method} is not allowed on /tickets` });
  }

  // ---------------------------------------------------------------------------
  // 404 Not Found fallback (Lab 3)
  // ---------------------------------------------------------------------------
  return sendJson(res, 404, {
    message: `404 - Route ${pathname} not found`,
    availableRoutes: ["GET /", "GET /tickets", "GET /tickets/:id", "POST /tickets", "PUT /tickets/:id", "DELETE /tickets/:id", "GET /audit"]
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(`🚀 TicketFlow Server running at http://localhost:${PORT}`);
  console.log(`🌐 REST Routes: GET, POST, PUT, DELETE at /tickets`);
  console.log(`📝 Audit Trail: GET /audit`);
  console.log(`=============================================================`);

  // Lab 1: Emit boot event
  eventBus.emit("system:boot", PORT);
});
