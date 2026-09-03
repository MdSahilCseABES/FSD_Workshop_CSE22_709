// Experiment 8
// CRUD operations on the studentDB.students collection:
//   1. Insert 5 student records
//   2. Find all students older than 20
//   3. Update a student's age using $set
//   4. Delete one student

const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function main() {
  await client.connect();
  console.log("Connected to MongoDB\n");

  const db = client.db("studentDB");
  const students = db.collection("students");

  // Empty the collection first so the output is the same every time we run it
  await students.deleteMany({});

  // ---------- 1. INSERT 5 STUDENTS ----------
  const result = await students.insertMany([
    { name: "Sahil", age: 21, course: "CSE" },
    { name: "Rahul", age: 22, course: "IT" },
    { name: "Priya", age: 19, course: "CSE" },
    { name: "Amit", age: 23, course: "ECE" },
    { name: "Neha", age: 20, course: "IT" },
  ]);

  console.log("1. INSERT -> inserted", result.insertedCount, "students\n");

  // ---------- 2. FIND STUDENTS OLDER THAN 20 ----------
  // $gt means "greater than". find() gives a cursor, so we call toArray().
  const olderStudents = await students.find({ age: { $gt: 20 } }).toArray();

  console.log("2. FIND   -> students older than 20:");
  olderStudents.forEach(function (s) {
    console.log("   " + s.name + " - age " + s.age + " - " + s.course);
  });
  console.log("   Total found:", olderStudents.length, "\n");

  // ---------- 3. UPDATE AN AGE USING $set ----------
  // First value = which document to change, second = what to change.
  // $set changes only the age field and leaves the other fields alone.
  const updateResult = await students.updateOne(
    { name: "Priya" },
    { $set: { age: 25 } }
  );

  console.log("3. UPDATE -> matched:", updateResult.matchedCount,
              " modified:", updateResult.modifiedCount);

  // Read it back to confirm the change actually happened
  const updatedStudent = await students.findOne({ name: "Priya" });
  console.log("   Priya's age is now:", updatedStudent.age, "\n");

  // ---------- 4. DELETE ONE STUDENT ----------
  const deleteResult = await students.deleteOne({ name: "Amit" });
  console.log("4. DELETE -> deleted:", deleteResult.deletedCount, "student\n");

  // ---------- FINAL LIST ----------
  const allStudents = await students.find().toArray();
  console.log("Final list of students:");
  allStudents.forEach(function (s) {
    console.log("   " + s.name + " - age " + s.age + " - " + s.course);
  });
  console.log("Total students:", allStudents.length);
}

main()
  .catch(function (err) {
    console.log("Error:", err.message);
    console.log("\nIs MongoDB running? Start it with: brew services start mongodb-community");
  })
  .finally(function () {
    client.close();
  });
