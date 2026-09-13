// =============================================================================
// Lab Experiment 1: Custom EventEmitter & Event Loop Order
// =============================================================================
// This module provides an event-driven architecture for our Helpdesk system:
// 1. Custom EventEmitter: Dispatches domain events (ticket:created, ticket:updated, etc.)
// 2. DOM-like Event Listeners: Handles incoming events and updates listeners
// 3. Event Loop Demonstration: Uses process.nextTick and setImmediate to simulate
//    immediate internal logging vs. background non-blocking notifications.
// =============================================================================

const EventEmitter = require("events");
const fileStorage = require("./fileStorage");

class TicketEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.totalEventsHandled = 0;
    this._registerDefaultListeners();
  }

  _registerDefaultListeners() {
    // 1. Listen for Ticket Creation
    this.on("ticket:created", (ticket) => {
      this.totalEventsHandled++;
      console.log(`\n[EVENT: ticket:created] Ticket #${ticket.id} created by ${ticket.createdBy}: "${ticket.title}"`);

      // Lab 1 Event Loop: process.nextTick runs in the microtask phase immediately
      // after the current synchronous script
      process.nextTick(() => {
        fileStorage.appendAuditLog("TICKET_CREATED", {
          id: ticket.id,
          title: ticket.title,
          priority: ticket.priority,
          createdBy: ticket.createdBy
        });
        console.log(`[EventLoop - nextTick] Audit log updated for Ticket #${ticket.id}`);
      });

      // Check if ticket is High priority -> emit urgent event
      if (ticket.priority && ticket.priority.toLowerCase() === "high") {
        this.emit("ticket:urgent", ticket);
      }
    });

    // 2. Listen for Urgent / High-Priority Tickets
    this.on("ticket:urgent", (ticket) => {
      this.totalEventsHandled++;
      console.log(`[EVENT: ticket:urgent] 🚨 URGENT ACTION REQUIRED for Ticket #${ticket.id}: "${ticket.title}"`);

      // Lab 1 Event Loop: setImmediate runs in the Check phase of the Event Loop
      // simulating a non-blocking asynchronous email/SMS notification to lab technicians
      setImmediate(() => {
        console.log(`[EventLoop - setImmediate] 📧 [Notification Sent] Simulated alert dispatched to on-duty technician for Ticket #${ticket.id}`);
        fileStorage.appendAuditLog("URGENT_DISPATCH", {
          ticketId: ticket.id,
          technicianNotified: true
        });
      });
    });

    // 3. Listen for Ticket Updates
    this.on("ticket:updated", (data) => {
      this.totalEventsHandled++;
      console.log(`[EVENT: ticket:updated] Ticket #${data.id} updated. Changes:`, data.changes);

      process.nextTick(() => {
        fileStorage.appendAuditLog("TICKET_UPDATED", data);
        console.log(`[EventLoop - nextTick] Audit log updated for Ticket #${data.id}`);
      });
    });

    // 4. Listen for Ticket Deletion
    this.on("ticket:deleted", (ticket) => {
      this.totalEventsHandled++;
      console.log(`[EVENT: ticket:deleted] Ticket #${ticket.id} (${ticket.title}) was removed`);

      process.nextTick(() => {
        fileStorage.appendAuditLog("TICKET_DELETED", { id: ticket.id, title: ticket.title });
        console.log(`[EventLoop - nextTick] Deletion logged for Ticket #${ticket.id}`);
      });
    });

    // 5. One-time startup event using once() (Lab 1 concept)
    this.once("system:boot", (port) => {
      console.log(`[EVENT: system:boot (once)] Helpdesk Event Bus initialized and listening on port ${port}.`);
      fileStorage.appendAuditLog("SYSTEM_BOOT", `Server started on port ${port}`);
    });
  }
}

// Create a singleton instance to be shared throughout the application
const eventBus = new TicketEventEmitter();

module.exports = eventBus;
