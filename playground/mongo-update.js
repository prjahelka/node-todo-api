//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        console.log('Error connecting to ToDoApp db: ', err);
        return;
    }
    console.log('ToDoApp db open');

    db.collection('Users').
    findOneAndUpdate({ _id: new ObjectID("58ff47782fb9a31449d8300f") }, {
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log('Result: ', result);
        db.close();
    }, (err) => {
        console.log('Unable to delete ToDos', err);
        db.close();
    });

    //db.close();
});