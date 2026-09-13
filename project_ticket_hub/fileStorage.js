// =============================================================================
// Lab Experiment 2: File CRUD Operations using the 'fs' Module
// =============================================================================
// This module provides persistent file storage for our Helpdesk system:
// 1. CREATE & READ: Loads or initializes tickets from 'data/tickets.json'
// 2. UPDATE: Rewrites updated ticket data to disk
// 3. APPEND: Appends timestamped actions to 'data/audit.log'
// 4. DELETE / UNLINK: Allows resetting the audit log using fs.unlinkSync()
// =============================================================================

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const TICKETS_FILE = path.join(DATA_DIR, "tickets.json");
const AUDIT_LOG_FILE = path.join(DATA_DIR, "audit.log");

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed tickets if tickets.json does not exist yet
const SEED_TICKETS = [
  {
    id: 1,
    title: "Wi-Fi not working in Lab 3",
    category: "Network",
    priority: "High",
    status: "Open",
    createdBy: "Sahil",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Projector lamp replacement in Room 204",
    category: "Hardware",
    priority: "Medium",
    status: "In Progress",
    createdBy: "Rahul",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Request for VS Code extension pack",
    category: "Software",
    priority: "Low",
    status: "Closed",
    createdBy: "Priya",
    createdAt: new Date().toISOString()
  }
];

// 1. READ TICKETS FROM FILE (Lab 2: fs.existsSync & fs.readFileSync)
function loadTickets() {
  try {
    if (!fs.existsSync(TICKETS_FILE)) {
      // If file doesn't exist, create it with seed data (Lab 2: CREATE)
      saveTickets(SEED_TICKETS);
      appendAuditLog("SYSTEM_INIT", "tickets.json initialized with default records");
      return SEED_TICKETS;
    }
    const rawData = fs.readFileSync(TICKETS_FILE, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("[fileStorage] Error reading tickets.json:", error.message);
    return [];
  }
}

// 2. WRITE / UPDATE TICKETS TO FILE (Lab 2: fs.writeFileSync)
function saveTickets(tickets) {
  try {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("[fileStorage] Error saving tickets.json:", error.message);
    return false;
  }
}

// 3. APPEND TO AUDIT LOG (Lab 2: fs.appendFileSync)
function appendAuditLog(action, details) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${action}] ${typeof details === "object" ? JSON.stringify(details) : details}\n`;

  try {
    fs.appendFileSync(AUDIT_LOG_FILE, logEntry, "utf-8");
  } catch (error) {
    console.error("[fileStorage] Error appending to audit.log:", error.message);
  }
}

// 4. READ AUDIT LOG (Lab 2: fs.readFileSync)
function getAuditLog() {
  try {
    if (!fs.existsSync(AUDIT_LOG_FILE)) {
      return "No audit logs recorded yet.\n";
    }
    return fs.readFileSync(AUDIT_LOG_FILE, "utf-8");
  } catch (error) {
    return `Error reading audit log: ${error.message}`;
  }
}

// 5. DELETE / RESET AUDIT LOG (Lab 2: fs.unlinkSync)
function resetAuditLog() {
  try {
    if (fs.existsSync(AUDIT_LOG_FILE)) {
      fs.unlinkSync(AUDIT_LOG_FILE);
      appendAuditLog("AUDIT_RESET", "Audit log was cleared and reset.");
      return { success: true, message: "Audit log deleted and reset successfully." };
    }
    return { success: true, message: "Audit log was already empty." };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  loadTickets,
  saveTickets,
  appendAuditLog,
  getAuditLog,
  resetAuditLog,
  TICKETS_FILE,
  AUDIT_LOG_FILE
};
