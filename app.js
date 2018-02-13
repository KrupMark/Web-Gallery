var express = require('express');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var Mainpage = 'index.html';

// Login data
loginUser = 'albert';
loginPasswd = 'valami';

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

// Index or Main = /
router.get("/",function(req,res) {
  res.sendFile(path + Mainpage);
});

// Login = /login
router.get("/login",function(req,res){
  res.sendFile(path + "login.html");
});

// Register = /register
router.get("/register",function(req,res){
  res.sendFile(path + "register.html");
});

// Login
app.post('/login', function (req, res) {
  var post = req.body;
  console.log("post data: "+post.user);
  console.log(post);
  if (post.user === loginUser && post.password === loginPasswd) {
    // req.session.user_id = user_id;
    Mainpage = 'main.html';
    res.redirect('/');
  } else {
    res.send('Rossz felhasználónév/jelszó');
  }
});

// Registration
app.post('/reg', function (req, res) {
  var post = req.body;
  console.log(post);
  dataUsername = post.user;
  dataPasswd = post.password;
  dataEmail = post.email;
  dataConfEmail = post.confEmail;
  if (post.email === post.confEmail) {
    res.send('Sikeres regisztráció!');
  } else {
    console.log("E-mail address error!");
    res.send('Nem egyezik az e-mail cím!');
  }
});

// Logout
router.get("/logout",function(req,res){
  Mainpage = 'index.html';
  res.redirect('/');
});

app.use("/",router);

app.listen(3000,function(){
  console.log("A szerver működik")
  console.log("3000-es porton elérhető!");
});
