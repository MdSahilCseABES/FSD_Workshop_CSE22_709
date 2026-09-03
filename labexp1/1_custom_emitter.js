// Experiment 1 - Part 1
// Custom EventEmitter that triggers "greet" or "exit"

const EventEmitter = require("events");

// Our own class that gets all the emitter powers from EventEmitter
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// Listener for the "greet" event
myEmitter.on("greet", function (name) {
  console.log("Hello " + name + ", welcome to the FSD Workshop!");
});

// Listener for the "exit" event
myEmitter.on("exit", function (name) {
  console.log("Goodbye " + name + ", see you in the next class.");
});

// Now we fire the events
console.log("--- Firing events ---");
myEmitter.emit("greet", "Sahil");
myEmitter.emit("exit", "Sahil");

// We can decide which event to fire based on a value
const action = "greet";

console.log("\n--- Firing event based on a variable ---");
if (action === "greet") {
  myEmitter.emit("greet", "Rahul");
} else {
  myEmitter.emit("exit", "Rahul");
}

// once() runs the listener only the first time the event is fired
myEmitter.once("greet", function () {
  console.log("This message will print only one time.");
});

console.log("\n--- Testing once() ---");
myEmitter.emit("greet", "Amit");
myEmitter.emit("greet", "Amit");

// Number of listeners still attached to "greet"
console.log("\nListeners on greet:", myEmitter.listenerCount("greet"));
