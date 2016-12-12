const mongoose = require('mongoose');
const validator = require('validator'); //for validation aspects of the platform
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');



var UserSchema = new mongoose.Schema({ //rearrange of the below code to enable tokens and auth // can be any name for the variable //mongoose --> object
   //schema takes an object - as below
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        // validator: (value) => {
        //   return validator.isEmail(value);
        // }, -- 0r
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      require: true,
      minlength: 6
    },
    tokens: [{ //available in mongodb but no sql. Is also an array
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        require: true
      }
    }]
  });

//UserSchema.method - object,, can add any method, instance method
//generateAuthToken is an instance method -


UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};


//calls instance method. which call the individual document
UserSchema.methods.generateAuthToken = function () { //method is a mongoose method : http://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
  var user = this; // Instance methods.. arrow functions do not bind a this keywork. Hence why we need to use this function this way - this keyword stores individual document
  var access = 'auth';
  var token  = jwt.sign({_id: user._id.toHexString(), access}, 'secret value').toString();

  user.tokens.push({access, token}); //user.tokens empty array by default

  return user.save().then(() => { //user.save() returns a promise, hence we can call the then function
    return token;
  });
};


//calls model method, not instance method
UserSchema.statics.findByToken = function(token) {
    var User = this; //called as the model binding. Model Methods. Get called with the model binding to this.
    var decoded; //creating undefined method - uncoded jwt methods
    try {
      decoded = jwt.verify(token, 'secret value')
    } catch (e) {
      return Promise.reject();
      //return new Promise((resolve, reject) {
      // reject();
      // })
      //
    }
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next) { //needs to be a normal function as we need to get access to the this variable. If we do not call next, the function will loop forever and never finish. The app will crash
  var user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
    } else {
        next();
    };
  });

var User = mongoose.model('User', UserSchema);


// var User = mongoose.model('User', {
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 1,
//     unique: true,
//     validate: {
//       // validator: (value) => {
//       //   return validator.isEmail(value);
//       // }, -- 0r
//       validator: validator.isEmail,
//       message: '{VALUE} is not a valid email'
//     }
//   },
//   password: {
//     type: String,
//     require: true,
//     minlength: 6
//   },
//   tokens: [{ //available in mongodb but no sql. Is also an array
//     access: {
//       type: String,
//       require: true
//     },
//     token: {
//       type: String,
//       require: true
//     }
//   }]
// });


module.exports = {User}
