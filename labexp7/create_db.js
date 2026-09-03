// Experiment 7
// Create a database named studentDB with a collection named students.
//
// MongoDB creates the database and the collection automatically the first
// time you insert something into them. So this script inserts one student
// and then prints the list of databases and collections to prove it worked.

const { MongoClient } = require("mongodb");

// Change this line if you are using MongoDB Atlas instead of a local server.
// Atlas example:
// const url = "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net";
const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

async function main() {
  // connect() opens the connection to the MongoDB server
  await client.connect();
  console.log("Connected to MongoDB");

  // Pick the database. It does not exist yet, and that is fine.
  const db = client.db("studentDB");

  // Pick the collection. Also created on first insert.
  const students = db.collection("students");

  // Insert one student so that studentDB and students actually get created
  const result = await students.insertOne({
    name: "Sahil",
    age: 21,
    course: "CSE",
  });

  console.log("Inserted one student with _id:", result.insertedId);

  // Now list the collections inside studentDB
  const collections = await db.listCollections().toArray();
  console.log("\nCollections inside studentDB:");
  collections.forEach(function (c) {
    console.log(" -", c.name);
  });

  // Count how many documents are inside students
  const count = await students.countDocuments();
  console.log("\nNumber of documents in students:", count);

  // List all databases on the server
  const dbList = await client.db().admin().listDatabases();
  console.log("\nDatabases on this server:");
  dbList.databases.forEach(function (d) {
    console.log(" -", d.name);
  });
}

main()
  .catch(function (err) {
    console.log("Error:", err.message);
    console.log("\nIs MongoDB running? Start it with: brew services start mongodb-community");
  })
  .finally(function () {
    // Always close the connection, otherwise the script never exits
    client.close();
  });
