//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        console.log('Error connecting to ToDoApp db: ', err);
        return;
    }
    console.log('ToDoApp db open');

    // deleteManuy
    // db.collection('ToDos').
    // deleteMany({ title: 'Eat lunch' }).
    // then((result) => {
    //     console.log('Result: ', result);
    // }, (err) => {
    //     console.log('Unable to delete ToDos', err);
    // });

    // deleteOne
    // db.collection('ToDos').
    // deleteOne({ title: 'Eat lunch' }).
    // then((result) => {
    //     console.log('Result: ', result);
    // }, (err) => {
    //     console.log('Unable to delete ToDos', err);
    // });

    // findOneAndDelete
    // db.collection('ToDos').
    // findOneAndDelete({ completed: false }).
    // then((result) => {
    //     console.log('Result: ', result);
    //     db.close();
    // }, (err) => {
    //     console.log('Unable to delete ToDos', err);
    //     db.close();
    // });

    // _id is number from my custom id record:
    // db.collection('Users').
    // findOneAndDelete({ _id: 123 }).
    // then((result) => {
    //     console.log('Result: ', result);
    //     db.close();
    // }, (err) => {
    //     console.log('Unable to delete ToDos', err);
    //     db.close();
    // });

    // db.collection('Users').
    // deleteMany({ name: 'Pete Jahelka' }).
    // then((result) => {
    //     console.log('Result: ', result);
    //     db.close();
    // }, (err) => {
    //     console.log('Unable to delete ToDos', err);
    //     db.close();
    // });

    //db.close();
});