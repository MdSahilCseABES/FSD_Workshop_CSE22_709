// Experiment 1 - Part 2
// Simulating DOM-like event handling in Node.js using the events module
//
// In the browser we write: button.addEventListener("click", handler)
// Node.js has no DOM, so we build a small fake "button" using EventEmitter.

const EventEmitter = require("events");

// A fake DOM element. It keeps a name and can listen to / fire events.
class FakeElement extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
  }

  // Same idea as addEventListener in the browser
  addEventListener(eventName, handler) {
    this.on(eventName, handler);
    console.log("Listener added for '" + eventName + "' on " + this.name);
  }

  // Same idea as removeEventListener
  removeEventListener(eventName, handler) {
    this.off(eventName, handler);
    console.log("Listener removed for '" + eventName + "' on " + this.name);
  }

  // The browser fires events by itself. Here we fire them manually.
  dispatchEvent(eventName, eventData) {
    console.log("\n>> Event fired: " + eventName);
    this.emit(eventName, eventData);
  }
}

// Create two fake elements
const button = new FakeElement("submitButton");
const inputBox = new FakeElement("nameInput");

// Handler functions
function handleClick(event) {
  console.log("Button clicked at x=" + event.x + ", y=" + event.y);
}

function handleDoubleClick() {
  console.log("Button double clicked!");
}

function handleTyping(event) {
  console.log("User typed: " + event.value);
}

// Attach the handlers
button.addEventListener("click", handleClick);
button.addEventListener("dblclick", handleDoubleClick);
inputBox.addEventListener("input", handleTyping);

// Fire the events
button.dispatchEvent("click", { x: 120, y: 45 });
button.dispatchEvent("dblclick", {});
inputBox.dispatchEvent("input", { value: "Sahil" });

// One event can have more than one listener, just like in the DOM
button.addEventListener("click", function () {
  console.log("Second click listener also ran.");
});
button.dispatchEvent("click", { x: 10, y: 20 });

// Remove a listener and fire again to prove it is gone
console.log("");
button.removeEventListener("click", handleClick);
button.dispatchEvent("click", { x: 99, y: 99 });
