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

    // db.collection('Users').insertOne({
    //         name: 'Pete Jahelka',
    //         age: 57,
    //         location: 'Denver'
    //     }, (err, result) => {
    //         if (err) {
    //             return console.log('Error adding to ToDos: ', err);
    //         }
    //         console.log('Success: ', JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    //     })
    // db.collection('ToDos').insertOne({
    //     title: 'a title',
    //     text: 'something to do',
    //     complete: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Error adding to ToDos: ', err);
    //     }
    //     console.log('Success: ', JSON.stringify(result.ops, undefined, 2));
    // })

    db.close();
});