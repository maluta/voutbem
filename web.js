// web.js
var express = require("express");
var logfmt = require("logfmt");
var bodyParser = require("body-parser");
var path = require("path");
var Parse = require("parse").Parse;

var app = express();

app.use(logfmt.requestLogger());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('index', {});
});

app.get('/add', function(req, res) {
  res.send('');
});



console.log(process.env.PORT);
var port = Number(process.env.PORT || 5000);
//var port = Number(8001);
app.listen(port, function() {
  console.log("Listening on " + port);
});