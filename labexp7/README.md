# Experiment 7

## Objective

Install MongoDB locally (or use MongoDB Atlas). Create a new database named
**studentDB** with a collection named **students**.

## Technologies Used

- MongoDB Community Server
- mongosh (the MongoDB shell)
- Node.js with the `mongodb` driver

## Files

| File | What it does |
|------|--------------|
| create_db.js | Creates studentDB + students using Node.js |
| mongo_commands.js | The same thing using mongosh commands |

## Part A — Installing MongoDB on macOS

Install Homebrew first if you do not have it, then:

```
brew tap mongodb/brew
```

```
brew install mongodb-community
```

Start the MongoDB server (it keeps running in the background):

```
brew services start mongodb-community
```

Check that it is running:

```
brew services list
```

You should see `mongodb-community` with the status **started**.

Install the shell if `mongosh` is not found:

```
brew install mongosh
```

### Option B — MongoDB Atlas (no installation)

If you do not want to install MongoDB, make a free cluster on
https://cloud.mongodb.com, click **Connect**, copy the connection string, and
replace the `url` line in `create_db.js` with it:

```js
const url = "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net";
```

## Part B — Creating the database with mongosh

Open the shell:

```
mongosh
```

Then type these commands inside the shell:

```
use studentDB
db.createCollection("students")
db.students.insertOne({ name: "Sahil", age: 21, course: "CSE" })
show collections
db.students.find()
```

Type `exit` to leave the shell.

You can also run the whole file at once:

```
mongosh mongo_commands.js
```

## Part C — Creating the database with Node.js

```
npm install
```

```
npm start
```

## Expected Output

**From mongosh:**

```
test> use studentDB
switched to db studentDB

studentDB> db.createCollection("students")
{ ok: 1 }

studentDB> db.students.insertOne({ name: "Sahil", age: 21, course: "CSE" })
{
  acknowledged: true,
  insertedId: ObjectId('6607a1b2c3d4e5f6a7b8c9d0')
}

studentDB> show collections
students

studentDB> db.students.find()
[
  {
    _id: ObjectId('6607a1b2c3d4e5f6a7b8c9d0'),
    name: 'Sahil',
    age: 21,
    course: 'CSE'
  }
]
```

**From `npm start` (create_db.js):**

```
Connected to MongoDB
Inserted one student with _id: new ObjectId('6607a1b2c3d4e5f6a7b8c9d0')

Collections inside studentDB:
 - students

Number of documents in students: 1

Databases on this server:
 - admin
 - config
 - local
 - studentDB
```

Your `_id` values will be different — MongoDB generates a new one every time.

## Important points

- **MongoDB is created lazily.** Running `use studentDB` does not create the
  database. It only appears in `show dbs` after you insert the first document.
  Same for collections.
- **`_id`** — every document gets an `_id` field automatically. It is an
  `ObjectId`, not a number, and it is always unique.
- **Documents are not rows.** A document looks like a JavaScript object, and
  two documents in the same collection do not need the same fields.
- **Terminology:**

  | SQL | MongoDB |
  |-----|---------|
  | database | database |
  | table | collection |
  | row | document |
  | column | field |

- **Port 27017** is the default MongoDB port. `mongodb://127.0.0.1:27017` means
  "the MongoDB running on my own computer".
- **`client.close()`** is inside `finally` so the connection closes whether the
  script succeeded or failed. Without it the Node script hangs and never exits.

## Troubleshooting

If you see `ECONNREFUSED 127.0.0.1:27017`, MongoDB is not running. Start it:

```
brew services start mongodb-community
```

## Conclusion

The `studentDB` database with a `students` collection is ready. It can be
created either from the mongosh shell or from a Node.js script using the
official `mongodb` driver. The next experiment performs CRUD on it.
