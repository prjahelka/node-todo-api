const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo.js');
const { User } = require('../../models/user.js');

const todos = [{
    _id: new ObjectID(),
    text: 'Test todo 0'
}, {
    _id: new ObjectID(),
    text: 'Test todo 1',
    completed: false
}, {
    _id: new ObjectID(),
    text: 'Test todo 2',
    completed: true,
    completedAt: 333
}];

const user1id = new ObjectID();
const user2id = new ObjectID();
const access = 'auth';

const users = [{
    _id: user1id,
    email: 'prjahelka@maildomain.com',
    password: 'mysecretpassword1',
    tokens: [{
        access: access,
        token: jwt.sign({ _id: user1id.toHexString(), access }, 'secretsaltkey').toString()
    }]
}, {
    _id: user2id,
    email: 'prjahelka@mail2domain.com',
    password: 'mysecretpassword2'
}];

// reset the todo collection to always start with the 3 todo documents defined above

const populateTodos = ((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => {
        done();
    })
});

const populateUsers = ((done) => {
    User.remove([]).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    });
});

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
}