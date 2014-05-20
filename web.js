// web.js
var express = require("express");
var logfmt = require("logfmt");
var bodyParser = require("body-parser");
var path = require("path");
var routes = require('./routes')

var app = express();

app.use(logfmt.requestLogger());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());

app.use(function(request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  console.log(request.body);
  next();
});



/* GET */

app.get('/', function(req, res){
  res.render('index', { title: '' });
  console.log(req.body); 
});

app.get('/add', function(req, res){
  var d = new Date();
  var today = d.getDate();
  var month = d.getMonth() + 1; // january is 0
  res.render('add', { date: "Ex.: amanhã, dia " + today + "/"+ month });
});

app.get("/events/:id", function(req, res) {
  res.end("events, " + req.params.id + ".");
  // Fun fact: this has security issues
});

/* POST */

app.post("/events", function(req, res) {
  res.send(req.body.who + ", vai organizar: " + req.body.what + " lembrando que: " + req.body.info);
});


app.all('*', function(req, res){
  res.send(404);
})

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});