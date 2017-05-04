var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { ObjectID } = require('mongodb');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

// GET /todos/id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('invalid id');
    } else {
        Todo.findById(id).then((todo) => {
            if (!todo) {
                res.status(404).send('todo not found');
            } else {
                res.status(200).send({ todo });
            }
        }).catch((err) => {
            res.status(400).send(err);
        });
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };