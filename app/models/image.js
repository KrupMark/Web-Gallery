// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our image model
var imageSchema = mongoose.Schema({

  local       : {
    imID   : String,
    imName : String,
    imDis  : String,
    imPriv : Boolean
  },
});

module.exports = mongoose.model('Image', imageSchema);
