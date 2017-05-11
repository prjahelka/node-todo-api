/* global it, describe, beforeEach */

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server.js');
const { Todo } = require('./../models/todo.js');

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

// reset the todo collection to always start with the 3 todo documents defined above

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => {
        done();
    })
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Test do text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err /*, res*/ ) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should not create a todo from bad data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err /*, res*/ ) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });

});

describe('GET /todos:id', () => {

    it('should return 404 for invalid id', (done) => {
        request(app)
            .get('/todos:123')
            .expect(404)
            .end(done);
    });

    it('should return 400 for unknown id', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos:${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return a todo for a known id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should return 404 for invalid id', (done) => {
        request(app)
            .delete('/todos:123')
            .expect(404)
            .end(done);
    });

    it('should return 400 for unknown id', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos:${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should remove a todo for a known id', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should return 404 for invalid id', (done) => {
        request(app)
            .delete('/todos:123')
            .expect(404)
            .end(done);
    });

    it('should return 400 for unknown id', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos:${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should update todo 1 for a known id', (done) => {
        var newText = "new text";
        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({ text: newText })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBe(null)
            })
            .end(done);
    });

    it('should update todo 2 for a known id', (done) => {
        var newText = "new text";
        request(app)
            .patch(`/todos/${todos[2]._id.toHexString()}`)
            .send({ text: newText, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBe(null)
            })
            .end(done);
    });
});