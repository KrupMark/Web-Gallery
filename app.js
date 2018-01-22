var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 



router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/login",function(req,res){
  res.sendFile(path + "login.html");
});

app.post('/login', function (req, res) {
  var post = req.body.user;
  console.log("post data: "+post.user);
  console.log(post);
  if (post.User === 'albert' && post.Password === 'valami') {
    req.session.user_id = albert_user_id_here;
    res.redirect('/');
  } else {
    res.send('Rossz felhasználónév/jelszó');
  }
});

router.get("/register",function(req,res){
  res.sendFile(path + "register.html");
});

app.use("/",router);

app.listen(3000,function(){
  console.log("3000-es porton elérhető!");
});
