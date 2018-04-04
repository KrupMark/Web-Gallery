// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/images');

module.exports = function(passport) {
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      imageNameField : 'imageName',
      imageTitleField : 'imageTitle',
      imageDescriptionField : 'imageDescription',
      imagePrivateField : 'imagePrivate',
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, imageName, imageTitle, done) {
      var imageDescription = req.body.imageDescription;
      var imagePrivate = req.body.imagePrivate;
      // asynchronous
      process.nextTick(function() {
        var newImage = new Image();
        newImage.image.imageName = data-dz-name;
        newImage.image.imageTitle = imageTitle;
        newImage.image.imageDescription = imageDescription;
        newImage.image.imagePrivate = imagePrivate;
        newUser.save(function(err) {
          if (err)
            return done(err);
            return done(null, newImage);
        });
      });
    }));

}
