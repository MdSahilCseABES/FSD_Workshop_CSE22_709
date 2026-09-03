// Experiment 2 (extra)
// Same CRUD operations written with the synchronous fs methods.
//
// The Sync methods block the program until they finish, so the code
// reads top to bottom like normal. Easier to read, but it freezes the
// server if you use it in a real project. Good for small scripts only.

const fs = require("fs");

const fileName = "marks.txt";

console.log("=== File CRUD using fs Sync methods ===\n");

// ---------- CREATE ----------
fs.writeFileSync(fileName, "Maths: 85\nPhysics: 78\n");
console.log("1. CREATE  -> " + fileName + " created");

// ---------- READ ----------
let data = fs.readFileSync(fileName, "utf8");
console.log("2. READ    -> contents:");
console.log(data);

// ---------- UPDATE ----------
fs.appendFileSync(fileName, "Chemistry: 90\n");
console.log("3. UPDATE  -> one more subject added");

data = fs.readFileSync(fileName, "utf8");
console.log("   contents now:");
console.log(data);

// ---------- DELETE ----------
fs.unlinkSync(fileName);
console.log("4. DELETE  -> " + fileName + " removed");
console.log("   File exists?", fs.existsSync(fileName));
