// Experiment 8 - the same CRUD operations using mongosh commands
//
// Run with:  mongosh mongo_commands.js
// Or open mongosh and type the lines one by one.

use("studentDB");

// Start clean so the output is the same every time
db.students.deleteMany({});

// ---------- 1. INSERT 5 STUDENTS ----------
db.students.insertMany([
  { name: "Sahil", age: 21, course: "CSE" },
  { name: "Rahul", age: 22, course: "IT" },
  { name: "Priya", age: 19, course: "CSE" },
  { name: "Amit", age: 23, course: "ECE" },
  { name: "Neha", age: 20, course: "IT" },
]);

print("1. Inserted 5 students. Total = " + db.students.countDocuments());

// ---------- 2. FIND STUDENTS OLDER THAN 20 ----------
print("\n2. Students older than 20:");
db.students.find({ age: { $gt: 20 } }).forEach(printjson);

// ---------- 3. UPDATE AGE USING $set ----------
db.students.updateOne({ name: "Priya" }, { $set: { age: 25 } });
print("\n3. Updated Priya's age:");
printjson(db.students.findOne({ name: "Priya" }));

// ---------- 4. DELETE ONE STUDENT ----------
db.students.deleteOne({ name: "Amit" });
print("\n4. Deleted Amit. Total now = " + db.students.countDocuments());

print("\nFinal list:");
db.students.find().forEach(printjson);
