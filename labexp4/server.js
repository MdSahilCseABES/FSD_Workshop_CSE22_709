// Experiment 4
// Basic GraphQL API using express-graphql
//
// In REST we make many URLs (/students, /students/1, ...).
// In GraphQL there is only ONE url (/graphql) and the client writes a
// query saying exactly which fields it wants.

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const port = 4000;

// Some sample data. In a real project this would come from a database.
const students = [
  { id: "1", name: "Sahil", course: "CSE", age: 21 },
  { id: "2", name: "Rahul", course: "CSE", age: 22 },
  { id: "3", name: "Priya", course: "IT", age: 20 },
];

// ---------- SCHEMA ----------
// The schema tells GraphQL what data exists and what shape it has.
// "!" means the field can never be null.
const schema = buildSchema(`
  type Student {
    id: ID!
    name: String!
    course: String!
    age: Int!
  }

  type Query {
    hello: String
    students: [Student]
    student(id: ID!): Student
  }

  type Mutation {
    addStudent(name: String!, course: String!, age: Int!): Student
  }
`);

// ---------- RESOLVERS ----------
// For every field in the schema we write a function that returns its value.
const root = {
  hello: function () {
    return "Hello from GraphQL!";
  },

  students: function () {
    return students;
  },

  // args holds the values the client passed, so args.id here
  student: function (args) {
    return students.find(function (s) {
      return s.id === args.id;
    });
  },

  addStudent: function (args) {
    const newStudent = {
      id: String(students.length + 1),
      name: args.name,
      course: args.course,
      age: args.age,
    };
    students.push(newStudent);
    return newStudent;
  },
};

// ---------- ROUTE ----------
// graphiql: true opens a web page where we can type queries and test them.
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get("/", function (req, res) {
  res.send("GraphQL server is running. Open <a href='/graphql'>/graphql</a>");
});

app.listen(port, function () {
  console.log("GraphQL server running at http://localhost:" + port + "/graphql");
  console.log("Open that link in the browser to use GraphiQL.");
  console.log("Press Ctrl + C to stop.");
});
