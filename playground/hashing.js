const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123!';
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log('the hash:', hash);
//     })
// });

var theHash = '$2a$10$C3kG84MY8ieRe3EICGDSfe5akJeVLuM5h5wwvK.W57r1mxN.6zoGK';

bcrypt.compare(password, theHash, (err, result) => {
    console.log('compare result: ', result);
})

// var data = {
//     id: 4
// };
// var token = jwt.sign(data, '123abc');
// console.log('token: ', token);
// var decoded = jwt.decode(token, '123abc');
// console.log('decoded: ', decoded);

// var message = "I am a typical user";
// var hash = SHA256(message).toString();
// console.log('Message: ', message);
// console.log('Hash: ', hash);
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
// // bad salt attempt:
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(data)).toString()
// var resulthash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resulthash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed');
// }
console.log('done');