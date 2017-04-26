//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// es6 object destructuring:
// var user = { name: 'Pete', age: 57 };
// var { name } = user;
// console.log('name: ', name);

// var objid = new ObjectID();
// console.log('objid: ', objid);

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        console.log('Error connecting to ToDoApp db: ', err);
        return;
    }
    console.log('ToDoApp db open');

    db.collection('Users').
    find({ name: 'Pete Jahelka' }).
    toArray().
    then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch Users', err);
    });

    // db.collection('ToDos').find().count().then((count) => {
    //     console.log('ToDos count: ', count);
    // }, (err) => {
    //     console.log('Unable to fetch ToDos', err);
    // });

    // db.collection('ToDos').
    // find({ _id: new ObjectID("58ff43e3ffc93a1435d600b2") }).
    // toArray().
    // then((docs) => {
    //     console.log('ToDos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch ToDos', err);
    // });

    //db.close();
});