# Experiment 4

## Objective

Set up a basic GraphQL API using `express-graphql`.

## Technologies Used

- Node.js
- Express.js
- graphql
- express-graphql (gives us the `/graphql` route and the GraphiQL test page)

## Folder Structure

```
labexp4/
├── package.json
├── server.js
└── README.md
```

## How to Run

Install the packages first (needs internet, only once):

```
npm install
```

Then start the server:

```
npm start
```

Terminal shows:

```
GraphQL server running at http://localhost:4000/graphql
```

## How to Test the Output

Open **http://localhost:4000/graphql** in the browser. A page called
**GraphiQL** opens. Type a query on the left side and press the ▶ button.

### Query 1 — simple hello

```graphql
{
  hello
}
```

Result:

```json
{ "data": { "hello": "Hello from GraphQL!" } }
```

### Query 2 — all students

```graphql
{
  students {
    id
    name
    course
    age
  }
}
```

Result:

```json
{
  "data": {
    "students": [
      { "id": "1", "name": "Sahil", "course": "CSE", "age": 21 },
      { "id": "2", "name": "Rahul", "course": "CSE", "age": 22 },
      { "id": "3", "name": "Priya", "course": "IT", "age": 20 }
    ]
  }
}
```

### Query 3 — ask for only the fields we need

This is the main advantage of GraphQL. Same route, smaller response.

```graphql
{
  students {
    name
  }
}
```

Result:

```json
{
  "data": {
    "students": [{ "name": "Sahil" }, { "name": "Rahul" }, { "name": "Priya" }]
  }
}
```

### Query 4 — one student by id

```graphql
{
  student(id: "2") {
    name
    course
  }
}
```

Result:

```json
{ "data": { "student": { "name": "Rahul", "course": "CSE" } } }
```

### Query 5 — mutation to add a student

```graphql
mutation {
  addStudent(name: "Anjali", course: "IT", age: 21) {
    id
    name
    course
  }
}
```

Result:

```json
{
  "data": {
    "addStudent": { "id": "4", "name": "Anjali", "course": "IT", "age": 21 }
  }
}
```

Run the "all students" query again and Anjali will now be in the list.
(The list is stored in a normal array, so it resets when the server restarts.)

### Testing from the terminal instead

```
curl -X POST http://localhost:4000/graphql -H "Content-Type: application/json" -d '{"query":"{ students { name age } }"}'
```

## Important points

- **buildSchema** — writes the schema using GraphQL's own language. It defines
  the types (`Student`), the read operations (`Query`) and the write
  operations (`Mutation`).
- **Query vs Mutation** — `Query` is for reading data, `Mutation` is for
  changing data. Same idea as GET vs POST in REST.
- **rootValue (resolvers)** — for every field in the schema there is a function
  that returns the actual value. `hello` returns a string, `students` returns
  the array.
- **args** — values sent by the client arrive as the first argument of the
  resolver, so `student(id: "2")` becomes `args.id`.
- **`!`** — means the field is required and can never be null.
- **graphiql: true** — turns on the built-in testing page. In a real project
  this is switched off before going live.
- Only **one URL** is used for everything, unlike REST which needs many URLs.

## Conclusion

GraphQL uses a single endpoint. The client sends a query describing exactly
which fields it wants, and the server sends back only those fields. This
avoids the over-fetching problem that REST APIs usually have.
