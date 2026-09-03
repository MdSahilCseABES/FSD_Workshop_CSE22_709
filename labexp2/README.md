# Experiment 2

## Objective

Perform CRUD operations on files using the `fs` module.

- **Create** a file
- **Read** the file
- **Update** the file
- **Delete** the file

## Technologies Used

- Node.js
- Built-in `fs` (file system) module

## Files

| File | What it does |
|------|--------------|
| file_crud.js | CRUD using the async (callback) methods |
| file_crud_sync.js | Same CRUD using the Sync methods |

## fs methods used

| Operation | Async method | Sync method |
|-----------|--------------|-------------|
| Create / overwrite | `fs.writeFile()` | `fs.writeFileSync()` |
| Read | `fs.readFile()` | `fs.readFileSync()` |
| Update (add at end) | `fs.appendFile()` | `fs.appendFileSync()` |
| Delete | `fs.unlink()` | `fs.unlinkSync()` |
| Check if file exists | — | `fs.existsSync()` |

## How to Run

```
node file_crud.js
node file_crud_sync.js
```

## Expected Output

**file_crud.js**

```
=== File CRUD using fs module ===

1. CREATE  -> student.txt created successfully
2. READ    -> file contents are:
-----
Name: Sahil
Course: FSD Workshop

-----
3. UPDATE  -> new lines added to the file
   File after update:
-----
Name: Sahil
Course: FSD Workshop
Roll No: 709
Semester: 5

-----
4. DELETE  -> student.txt deleted successfully
   Does the file still exist? false
```

**file_crud_sync.js**

```
=== File CRUD using fs Sync methods ===

1. CREATE  -> marks.txt created
2. READ    -> contents:
Maths: 85
Physics: 78

3. UPDATE  -> one more subject added
   contents now:
Maths: 85
Physics: 78
Chemistry: 90

4. DELETE  -> marks.txt removed
   File exists? false
```

## How to test it yourself

The script deletes the file at the end, so nothing is left behind. To watch the
file actually appear on disk, comment out the `deleteFile()` call (or the
`fs.unlinkSync` line) and run the file again. Then run `ls` and you will see
`student.txt` sitting in the folder. Open it in VS Code to read it.

## Conclusion

The `fs` module lets Node.js work with files on the computer. The callback
versions do not block the program, so the next operation is written inside the
callback of the previous one. The Sync versions are shorter to read but they
block everything until the operation finishes.
