const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
});

var hashedPassword = '$2a$10$lbAMRC0B8v9uHZTccyjqQe3lZaHKmHocsjYCZx1psVC2vbIV60puC';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})










//
// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc'); // takes object data user id - signs it creates hash and gives token data
// console.log(token);
//
// var decoded = jwt.verify(token, '123abcx');
// console.log('Different token' + decoded);
//
// if(data.id === decoded.id) {
//   console.log('Same token');
// } else {
//   console.log('Different token');
// }
// jwt.verify // takes that token and the secret and makes sure data not manipulated


//
// var message = "I am a legend of epic proporitions";
//
// var hash = SHA256(message).toString();
//
// console.log(`Message is: ${hash}`);
// console.log(`Message is: ${message}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// } // salt and hash
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// //salting the hash -adding something on top
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log("data not changed");
// } else {
//   console.log('data compromised');
// }
