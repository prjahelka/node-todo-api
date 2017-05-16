/* global it, describe, beforeEach */

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server.js');
const { Todo } = require('./../models/todo.js');
const { User } = require('./../models/user.js');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
            .send({ text: newText, completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBe(null)
            })
            .end(done);
    });
});

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if user not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'prjahelka@msn.com';
        var password = 'abc123';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    expect(user.email).toBe(email);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should return validation errors for invalid request', (done) => {
        request(app)
            .post('/users')
            .send({ email: 'notenough', password: 'pass' })
            .expect(400)
            .end(done);
    });

    it('should not create a user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({ email: users[1].email, password: users[1].password })
            .expect(400)
            .end(done);
    });

});

describe('POST /users/login', () => {

    it('should login a user', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[0].email, password: users[0].password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(users[0].password);
                    expect(user.email).toBe(users[0].email);
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    })
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should report an error for an invalid user login', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[0].password })
            .expect(400)
            .end(done);
    });

});

describe('DELETE /users/me/token', () => {

    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user).toExist();
                    expect(user.tokens.length).toBe(0)
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

});