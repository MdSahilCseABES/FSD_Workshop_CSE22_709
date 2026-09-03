// Experiment 2
// CRUD operations on files using the fs module
//
// C - Create  -> writeFile
// R - Read    -> readFile
// U - Update  -> appendFile (and writeFile to replace)
// D - Delete  -> unlink
//
// We use the callback style here so the order of operations stays clear.

const fs = require("fs");

const fileName = "student.txt";

// ---------- CREATE ----------
function createFile() {
  fs.writeFile(fileName, "Name: Sahil\nCourse: FSD Workshop\n", function (err) {
    if (err) {
      console.log("Error while creating file:", err.message);
      return;
    }
    console.log("1. CREATE  -> " + fileName + " created successfully");
    readFile();
  });
}

// ---------- READ ----------
function readFile() {
  // "utf8" tells Node to give us text instead of raw bytes
  fs.readFile(fileName, "utf8", function (err, data) {
    if (err) {
      console.log("Error while reading file:", err.message);
      return;
    }
    console.log("2. READ    -> file contents are:");
    console.log("-----");
    console.log(data);
    console.log("-----");
    updateFile();
  });
}

// ---------- UPDATE ----------
function updateFile() {
  // appendFile adds text at the end without deleting what is already there
  fs.appendFile(fileName, "Roll No: 709\nSemester: 5\n", function (err) {
    if (err) {
      console.log("Error while updating file:", err.message);
      return;
    }
    console.log("3. UPDATE  -> new lines added to the file");

    // Read again so we can see the change
    fs.readFile(fileName, "utf8", function (err, data) {
      if (err) {
        console.log("Error while reading file:", err.message);
        return;
      }
      console.log("   File after update:");
      console.log("-----");
      console.log(data);
      console.log("-----");
      deleteFile();
    });
  });
}

// ---------- DELETE ----------
function deleteFile() {
  fs.unlink(fileName, function (err) {
    if (err) {
      console.log("Error while deleting file:", err.message);
      return;
    }
    console.log("4. DELETE  -> " + fileName + " deleted successfully");

    // existsSync returns true or false, so we can confirm it is really gone
    console.log("   Does the file still exist?", fs.existsSync(fileName));
  });
}

// Start the chain
console.log("=== File CRUD using fs module ===\n");
createFile();
