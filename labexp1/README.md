# Experiment 1

## Objective

1. Create a custom EventEmitter that triggers "greet" or "exit"
2. Simulate DOM-like event handling in Node.js using the events module
3. Visualize the event loop using setTimeout, setImmediate and process.nextTick

## Technologies Used

- Node.js
- Built-in `events` module (no npm install needed)

## Files

| File | What it does |
|------|--------------|
| 1_custom_emitter.js | Custom emitter class with "greet" and "exit" events |
| 2_dom_like_events.js | Fake DOM element with addEventListener / dispatchEvent |
| 3_event_loop.js | Shows the order in which the event loop runs callbacks |

## How to Run

Open the terminal inside this folder and run each file one by one.

```
node 1_custom_emitter.js
node 2_dom_like_events.js
node 3_event_loop.js
```

## Expected Output

**1_custom_emitter.js**

```
--- Firing events ---
Hello Sahil, welcome to the FSD Workshop!
Goodbye Sahil, see you in the next class.

--- Firing event based on a variable ---
Hello Rahul, welcome to the FSD Workshop!

--- Testing once() ---
Hello Amit, welcome to the FSD Workshop!
This message will print only one time.
Hello Amit, welcome to the FSD Workshop!

Listeners on greet: 1
```

**2_dom_like_events.js**

```
Listener added for 'click' on submitButton
Listener added for 'dblclick' on submitButton
Listener added for 'input' on nameInput

>> Event fired: click
Button clicked at x=120, y=45

>> Event fired: dblclick
Button double clicked!

>> Event fired: input
User typed: Sahil
Listener added for 'click' on submitButton

>> Event fired: click
Button clicked at x=10, y=20
Second click listener also ran.

Listener removed for 'click' on submitButton

>> Event fired: click
Second click listener also ran.
```

**3_event_loop.js**

```
1. Start of the program (synchronous)
2. End of the program (synchronous)
3. process.nextTick      -> runs before promises
4. Promise.then          -> microtask queue
5. setImmediate          -> check phase
6. setTimeout with 0 ms  -> timers phase
7. setTimeout with 10 ms -> timers phase (later turn)
```

Lines 5 and 6 can swap if you run the file again. `setTimeout(0)` is treated
as `setTimeout(1)` by Node, so whether that 1 ms has already finished when the
loop starts depends on machine speed. Lines 1, 2, 3, 4 and 7 never move.

## Conclusion

Node.js is event driven. Listeners are attached with `.on()` and fired with
`.emit()`. Synchronous code always runs first, then `process.nextTick`, then
promises, and only after that the timer and check phases of the event loop.
