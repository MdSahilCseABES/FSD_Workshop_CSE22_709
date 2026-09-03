# Experiment 8

## Objective

Perform the following on the `studentDB.students` collection:

1. Insert 5 student records
2. Find all students older than 20
3. Update a student's age using `$set`
4. Delete one student

## Technologies Used

- MongoDB
- mongosh
- Node.js with the `mongodb` driver

## Files

| File | What it does |
|------|--------------|
| crud.js | All four operations using Node.js |
| mongo_commands.js | The same four operations using mongosh |

## Before running

MongoDB must be running:

```
brew services start mongodb-community
```

Experiment 7 should be done first, since it creates `studentDB`.

## How to Run

**Using Node.js:**

```
npm install
```

```
npm start
```

**Using mongosh:**

```
mongosh mongo_commands.js
```

## The 5 records used

| Name | Age | Course |
|------|-----|--------|
| Sahil | 21 | CSE |
| Rahul | 22 | IT |
| Priya | 19 | CSE |
| Amit | 23 | ECE |
| Neha | 20 | IT |

## Commands used

| Operation | Command |
|-----------|---------|
| Insert 5 records | `db.students.insertMany([...])` |
| Find age > 20 | `db.students.find({ age: { $gt: 20 } })` |
| Update age | `db.students.updateOne({ name: "Priya" }, { $set: { age: 25 } })` |
| Delete one | `db.students.deleteOne({ name: "Amit" })` |
| Count | `db.students.countDocuments()` |

## Expected Output

**From `npm start` (crud.js):**

```
Connected to MongoDB

1. INSERT -> inserted 5 students

2. FIND   -> students older than 20:
   Sahil - age 21 - CSE
   Rahul - age 22 - IT
   Amit - age 23 - ECE
   Total found: 3

3. UPDATE -> matched: 1  modified: 1
   Priya's age is now: 25

4. DELETE -> deleted: 1 student

Final list of students:
   Sahil - age 21 - CSE
   Rahul - age 22 - IT
   Priya - age 25 - CSE
   Neha - age 20 - IT
Total students: 4
```

## How to test the output yourself

After running the script, open the shell and check the data by hand:

```
mongosh
```

```
use studentDB
db.students.find()
db.students.countDocuments()
db.students.find({ age: { $gt: 20 } })
```

There should be 4 documents, Priya's age should be 25, and Amit should be gone.

## Important points

- **`insertMany`** takes an array and inserts all of them in one call.
  `insertOne` takes a single object.
- **Comparison operators** start with a `$`:

  | Operator | Meaning |
  |----------|---------|
  | `$gt` | greater than |
  | `$gte` | greater than or equal to |
  | `$lt` | less than |
  | `$lte` | less than or equal to |
  | `$ne` | not equal to |

  Note that `$gt: 20` does **not** include Neha, who is exactly 20. Use
  `$gte: 20` if you want to include her.

- **`find()` returns a cursor, not an array.** A cursor is a pointer to the
  results. In Node you call `.toArray()` on it; in mongosh you call
  `.forEach()` or just press Enter and the shell prints it for you.
- **`$set` is important.** Writing
  `updateOne({ name: "Priya" }, { $set: { age: 25 } })` changes only the age.
  If you forget `$set` and write `updateOne({ name: "Priya" }, { age: 25 })`
  the driver throws an error, because MongoDB expects an update operator.
- **`updateOne` vs `updateMany`** — `updateOne` stops after the first matching
  document, even if several match. Same for `deleteOne` and `deleteMany`.
- **`matchedCount` vs `modifiedCount`** — `matchedCount` is how many documents
  the filter found, `modifiedCount` is how many actually changed. If you set the
  age to the value it already had, matched is 1 but modified is 0.
- **`deleteMany({})`** with an empty filter deletes everything in the
  collection. The script calls it at the start so that running it twice gives
  the same output instead of piling up duplicate students.

## Conclusion

All four CRUD operations work on the `students` collection. The filter object
decides *which* documents are affected, and the update operator (`$set`) decides
*what* changes inside them.
