module.exports = function(app, passport) {
// page routes

  // HOME PAGE
  app.get('/', function(req, res) {
    res.render('index.ejs', {
      pictures:fileRequest()
    });
  });

  // LOGGED PAGE
  app.get('/logged', isLoggedIn, function(req, res) {
    res.render('logged.ejs', {
      user : req.user,
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
      user : req.user,
      pictures:fileRequest()
    });
  });

 // UPLOAD
 var multer = require('multer');
 var path = require('path');
 var crypto = require('crypto');
 var storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, './uploads/')
   },
   // CHANGE FILES NAME
   filename: function (req, file, cb) {
     crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

       cb(null, file.originalname)
      })
    }
 });
 var upload = multer({ storage: storage });

  app.post( '/upload', upload.single('file'), function( req, res, next ) {

    if ( !req.file.mimetype.startsWith( 'image/' ) ) {
      return res.status( 422 ).json( {
        error : 'Kép fájlok megengedettek!'
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
    successRedirect : '/logged', // redirect to the secure profile section
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
    successRedirect : '/', // redirect to the secure profile section */profile*
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
