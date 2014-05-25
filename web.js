/*jslint node: true */
'use scrict';
var express = require('express');
var logfmt = require('logfmt');
var bodyParser = require('body-parser');
var path = require('path');
var routes = require('./routes');

var app = express();

app.use(logfmt.requestLogger());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());

app.use(function(request, response, next) {
  console.log('In comes a ' + request.method + ' to ' + request.url);
  console.log(request.body);
  next();
});

/* routes */
app.get('/', routes.index );
app.get('/add', routes.add);
app.get('/event/:id', routes.eventsId);


app.post('/events', routes.events);
app.post('/guests/:id', routes.guests);

setInterval(function() { routes.triggerEvents(); }, 30*60*60*1000);

app.all('*', function(req, res){
  res.send(404,":(");
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});