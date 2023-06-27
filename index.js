const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let PATH = path.join(__dirname, "todo-data.json");

let todos = [];

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

// function removeAtIndex(arr, index) {
//   let newArray = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (i !== index) newArray.push(arr[i]);
//   }

//   return newArray;
// }

app.get("/todos", (req, res) => {
  fs.readFile(PATH, "utf-8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    res.send(todos);
  });
});

app.get("/todos/:id", (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    res.json(todos[todoIndex]);
  }
});

app.post("/todos", (req, res) => {
  console.log(req.body);
  const newTodo = {
    id: uuidv4(), // unique random id
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
  };
  console.log("inside the post");
  fs.readFile(PATH, "utf-8", (err, data) => {
    if (err) throw err;
    console.log("inside the fs readfile");
    console.log(data, "the");
    const todos = JSON.parse(data);
    console.log(todos);
    todos.push(newTodo);
    fs.writeFile(PATH, JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(201).json(newTodo);
    });
  });
});

app.put("/todos/:id", (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos[todoIndex].title = req.body.title;
    todos[todoIndex].description = req.body.description;
    res.json(todos[todoIndex]);
  }
});

app.delete("/todos/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);
  fs.readFile(PATH, "utf-8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    let index = findIndex(todos, id);
    console.log(index);
    let data_1 = todos.splice(index, 1);
    fs.writeFile(PATH, JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(200).json(data_1);
    });
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// for all other routes, return 404

app.listen(3000, () => {
  console.log(`Server started at port ${3000}`);
  // fs.readFile(PATH, "utf8", (err, data) => {
  //   if (err) {
  //     console.error("Error reading JSON file:", err);
  //   } else {
  //     const jsonData = JSON.parse(data);
  //     console.log(jsonData);
  //   }
  // });
});

module.exports = app;
