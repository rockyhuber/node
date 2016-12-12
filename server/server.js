require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate.js');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


//////////// POST TODOS
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

///////////// GET TODOS

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos}); //{todos} === {todos: todo}
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

////////////// DELETE TODOS

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
  });

////////////// UPDATE TODOS

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});


///////////////// post Users

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
  });


/////////////////// get Route me


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);

  // var token = req.header('x-auth');
  // User.findByToken(token).then((user) => {
  //   if(!user) {
  //     // res.status(401).send();
  //     return Promise.reject();
  //   }
  //
  //   res.send(user);
  // }).catch((e) => {
  //   res.status(401).send();
  // });
});


/////////////// get Users //// TO DELETE down

app.get('/users', (req, res) => {
  User.find().then((users) => {
    var xy = [];
    for(i=0;i<users.length;i++) {
      xy.push(users[i].email);
    }
    abc = users + xy;
    res.send(abc); //{todos} === {todos: todo} // can only be called once
    // res.send(users);
  }, (e) => {
    res.status(400).send(e);
  });
});
////////// to delete up


if(!module.parent){
  app.listen(port, () => {
    console.log(`Started up at port ${port}`);
  }); // http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
};

module.exports = {app};
