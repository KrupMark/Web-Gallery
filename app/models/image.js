// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var imageSchema = mongoose.Schema({

  image              : {
    imageName        : String,
    imageTitle       : String,
    imageDescription : String,
    imageUploder     : String
  },
});

// create the model for images and expose it to our app
module.exports = mongoose.model('Image', userSchema);
