// Experiment 1 - Part 3
// Visualising the event loop using setTimeout, setImmediate and process.nextTick
//
// The output order is NOT the same as the order we write the code in.
// That is the whole point of this program.

console.log("1. Start of the program (synchronous)");

setTimeout(function () {
  console.log("6. setTimeout with 0 ms  -> timers phase");
}, 0);

setTimeout(function () {
  console.log("7. setTimeout with 10 ms -> timers phase (later turn)");
}, 10);

setImmediate(function () {
  console.log("5. setImmediate          -> check phase");
});

process.nextTick(function () {
  console.log("3. process.nextTick      -> runs before promises");
});

Promise.resolve().then(function () {
  console.log("4. Promise.then          -> microtask queue");
});

console.log("2. End of the program (synchronous)");

// Expected order:
//   1, 2  -> normal synchronous code always finishes first
//   3     -> process.nextTick queue is drained next (highest priority)
//   4     -> promise microtasks run after the nextTick queue
//   5     -> setImmediate runs in the check phase
//   6     -> setTimeout 0 ms runs in the timers phase
//   7     -> setTimeout 10 ms runs in a later turn of the loop
//
// NOTE: lines 5 and 6 can swap places if you run the file again.
// setTimeout(0) is really setTimeout(1) inside Node, so whether that 1 ms
// has already passed by the time the loop starts depends on how fast the
// machine started up. setImmediate does not have this problem, so it is
// the safer choice when you want "run this right after the current step".
// Lines 1, 2, 3, 4 and 7 always keep the same position.
