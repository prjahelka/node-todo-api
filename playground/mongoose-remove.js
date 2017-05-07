const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose.js');
const { Todo } = require('./../server/models/todo.js');
const { User } = require('./../server/models/user.js');

// Todo.remove({}).then((res) => {
//     console.log('remove: ', res);
// });


Todo.findByIdAndRemove('590ba86625e655b76fef620c').then((todo) => {
    console.log(todo);
});