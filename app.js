var express = require('express'),
    app = express(),
    router = express.Router(),
    // path = __dirname + '/views/',
    Mainpage = 'index.html',

    http = require('http'),
    mongoose = require('mongoose'),
    hash = require('./pass').hash;

// Database and Models
mongoose.connect("mongodb://localhost/Web-gallery");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    hash: String
});

var User = mongoose.model('users', UserSchema);

// Middlewares and configurations
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser('Web-Gallery'));
    app.use(express.session());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
});

app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    User.findOne({
        username: name
    },

    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

function userExist(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/register");
        }
    });
}

app.get("/", function (req, res) {

    if (req.session.user) {
        res.send("Welcome " + req.session.user.username);
    } else {
        res.send("<a href='/login'> Login</a>" + "<br>" + "<a href='/signup'> Sign Up</a>");
    }
});

app.get("/register", function (req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("signup");
    }
});

app.post("/register", userExist, function (req, res) {
    var password = req.body.password;
    var username = req.body.username;

    hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            username: username,
            salt: salt,
            hash: hash,
        }).save(function (err, newUser) {
            if (err) throw err;
            authenticate(newUser.username, password, function(err, user){
                if(user){
                    req.session.regenerate(function(){
                        req.session.user = user;
                        req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                        res.redirect('/');
                    });
                }
            });
        });
    });
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.redirect('/login');
        }
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.get('/profile', requiredAuthentication, function (req, res) {
    res.send('Profile page of '+ req.session.user.username +'<br>'+' click to <a href="/logout">logout</a>');
});








// // Login data
// loginUser = 'albert';
// loginPasswd = 'valami';

// var bodyParser = require('body-parser');
// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));
//
// router.use(function (req,res,next) {
//   console.log("/" + req.method);
//   next();
// });
//
// // Index or Main = /
// router.get("/",function(req,res) {
//   res.sendFile(path + Mainpage);
// });
//
// // Login = /login
// router.get("/login",function(req,res){
//   res.sendFile(path + "login.html");
// });
//
// // Register = /register
// router.get("/register",function(req,res){
//   res.sendFile(path + "register.html");
// });
//
// // Login
// app.post('/login', function (req, res) {
//   var post = req.body;
//   console.log("post data: "+post.user);
//   console.log(post);
//   if (post.user === username && post.password === password) {
//     // req.session.user_id = user_id;
//     Mainpage = 'main.html';
//     res.redirect('/');
//   } else {
//     res.send('Rossz felhasználónév/jelszó');
//   }
// });
//
// // Registration
// app.post('/reg', function (req, res) {
//   var post = req.body;
//   console.log(post);
//   dataUsername = post.user;
//   dataPasswd = post.password;
//   dataEmail = post.email;
//   dataConfEmail = post.confEmail;
//   if (post.email === post.confEmail) {
//     res.send('Sikeres regisztráció!');
//   } else {
//     console.log("E-mail address error!");
//     res.send('Nem egyezik az e-mail cím!');
//   }
// });
//
// // Logout
// router.get("/logout",function(req,res){
//   Mainpage = 'index.html';
//   res.redirect('/');
// });

app.use("/login",router);

app.listen(3000,function(){
  console.log("A szerver működik")
  console.log("3000-es porton elérhető!");
});
