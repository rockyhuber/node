const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '5847c2bfe3b6ee0d8006a7e0'}).then((todo) => { //takes id object not the id

});

Todo.findByIdAndRemove('5847c2bfe3b6ee0d8006a7e0').then((todo) => {
  console.log(`Remove todo: ${todo}`);
});
