var {User} = require('./../models/user');

//express middleware

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  //User (with capital) references the User model.
  User.findByToken(token).then((user) => {
    if(!user) { //an established user variable inside the function
      // res.status(401).send();
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next(); // will call the code below
  }).catch((e) => {
    res.status(401).send();
    //do not want to call next, as it will not run the code below
  });
};

module.exports = {authenticate};
