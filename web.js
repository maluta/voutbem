// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

console.log(process.env.PORT);
var port = Number(process.env.PORT || 5000);
//var port = Number(8001);
app.listen(port, function() {
  console.log("Listening on " + port);
});