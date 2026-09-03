// Experiment 7 - the same thing done inside the mongosh shell
//
// This file is NOT run with node. It is run inside mongosh:
//     mongosh mongo_commands.js
//
// Or you can open mongosh and type these lines one by one, which is
// what we did in the lab.

// "use" switches to the database. It is created when we first write to it.
use("studentDB");

// Create the students collection explicitly (optional).
// Normally the first insertOne creates it by itself.
db.createCollection("students");

// Insert one student
db.students.insertOne({ name: "Sahil", age: 21, course: "CSE" });

// Show what is inside
print("Collections in studentDB:");
printjson(db.getCollectionNames());

print("Documents in students:");
db.students.find().forEach(printjson);

print("Total documents: " + db.students.countDocuments());
