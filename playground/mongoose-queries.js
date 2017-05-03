const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose.js');
const { Todo } = require('./../server/models/todo.js');
const { User } = require('./../server/models/user.js');

// var id = '5906852acfb41682aa30bc26';
// var idbad = '6852acfb41682aa30bc26';

// if (!ObjectID.isValid(idbad)) {
//     console.log('id not valid');
// } else {
//     Todo.findById(idbad).then((todo) => {
//         if (!todo) {
//             return console.log('id not found');
//         }
//         console.log('Todo byid: ', todo);
//     }).catch((err) => {
//         console.log('error: ', err);
//     });
// };

var id = '590285bd011a653d6733ad5c';
var badid = '0285bd011a653d6733ad5c';

if (!ObjectID.isValid(id)) {
    console.log('invalid id');
} else {
    User.findById(id).then((user) => {
        if (user) {
            console.log('user: ', JSON.stringify(user, undefined, 2));
        } else {
            console.log('user not found');
        }
    }).catch((err) => {
        console.log('error: ', err);
    });
}