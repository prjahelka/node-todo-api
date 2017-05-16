require('./config/config.js');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo.js');
var { User } = require('./models/user.js');
var { authenticate } = require('./middleware/authenticate.js');

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

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    // get only the updateable properties
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('invalid id');
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    };
    // use the picked body object to update the todo
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo)
            return res.status(404).send('todo not found');

        res.send({ todo });
    }).catch((err) => {
        res.status(400).send(err);
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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('invalid id');
    } else {
        Todo.findByIdAndRemove(id).then((todo) => {
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

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send();
    });
});

// this is the learner route for creating the general middleware 
// method for authenticating the user for other routes
// code is migrated to authenticate.js

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };