var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
  image : {
    imageName: String,
    imageTitle: String,
    imageDescription: String,
    imagePrivate: Boolean
  },
});

module.exports = mongoose.model('Image', imageSchema);
