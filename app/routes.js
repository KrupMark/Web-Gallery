module.exports = function(app, passport) {
// page routes

  // HOME PAGE
  app.get('/', function(req, res) {
    res.render('index.ejs', {
      pictures:fileRequest()
    });
  });

  // PROFILE PAGE
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user
    });
  });

  // UPLOAD PAGE
  app.get('/upload', isLoggedIn, function(req, res) {
    res.render('upload.ejs', {
      user : req.user, pictures:fileRequest()
    });
  });

  var multer = require('multer');
  var upload = multer({dest: 'uploads/'});
  var sizeOf = require('image-size');
  var exphbs = require('express-handlebars');

  app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {

    if ( !req.file.mimetype.startsWith( 'image/' ) ) {
      return res.status( 422 ).json( {
        error : 'The uploaded file must be an image'
      } );
    }

    var dimensions = sizeOf( req.file.path );

    if ( ( dimensions.width < 100 ) || ( dimensions.height < 100 ) ) {
      return res.status( 422 ).json( {
        error : 'The image must be at least 2000 x 2000px'
      } );
    }

    return res.status( 200 ).send( req.file );
  });
  function fileRequest () {
      const uploadFolder = 'uploads/';
      const fs = require('fs');
      let pictures = [];

      fs.readdirSync(uploadFolder).forEach(file => {
      pictures.push(file);
    })
    return pictures;
  }

  // LOGOUT
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // AUTHENTICATE
  // LOGIN
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
    res.redirect('/');
}
