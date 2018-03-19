var express      = require('express');
var app          = express();
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB     = require('./config/database.js');
var port         = process.env.PORT || 3000;
var multer       = require('multer');
var upload       = multer({dest: 'uploads/'});
var sizeOf       = require('image-size');
var exphbs       = require('express-handlebars');
var serveStatic  = require('serve-static');
require('string.prototype.startswith');

// configuration
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/bower_components'));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'lialialialia', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.engine( '.hbs', exphbs( { extname: '.hbs' } ) );
app.set('view engine', '.hbs');

// routes
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// for images in index.ejs
app.use('/uploads', express.static(__dirname + '/uploads'));

// launch
app.listen(port);
console.log('Ezen a porton elérhető: ' + port);
