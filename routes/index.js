var config = require('./config'); 

var Parse = require("parse").Parse;
Parse.initialize(config.keyApp,config.keyJS);

exports.index = function(req, res){
  res.render('index', { title: '' });
  console.log(req.body); 
};

exports.add = function(req, res){
  var d = new Date();
  var today = d.getDate();
  var month = d.getMonth() + 1; // january is 0
  res.render('add', { date: "Ex.: amanhã, dia " + today + "/"+ month });
};

exports.eventsId = function(req, res) {

   var query = new Parse.Query("Events");
   query.get(req.params.id, {
            success: function(object) {
                 console.log("success");
                 /* mostrar quem esta indo */
                 
                 //res.send(200,"o evento existe :-) " + object.get("author"));

                 res.render('event', {event_author:object.get("author"), 
                 	                  event_title:object.get("title"), 
                 	                  event_info:object.get("info"),
                 	                  event_id:object.id,
                 	                  event_guests:object.get("guests")});
               
            },
            error: function(error) {
                res.send(404, "evento (" + req.params.id + ") não encontrado ou já expirado :(");
            }
        });
  
  // Fun fact: this has security issues
};


/* POST */
exports.guests = function(req, res, next) {
   console.log("ok --> req" + req.body.guestname + "." + req.originalUrl);
   var event_id = req.originalUrl.split("/")[2];

   var query = new Parse.Query("Events");
   query.get(event_id, {
            success: function(object) {
                 console.log("success");
                 /* mostrar quem esta indo */
                 object.addUnique("guests",req.body.guestname);
   				 
   				 object.save(null, {
      			 	success: function(post) {
                	// The post was updated successfully.
                		/*res.render('event', { event_author:object.get("author"), 
                 	    		              event_title:object.get("title"), 
                 	            		      event_info:object.get("info"),
                 	                  		  event_id:object.id,
                 	                  		  event_guests:object.get("guests")});*/
   				         res.redirect('/event/' + event_id);
            		},
             		error: function(error) {
                			res.send(404, "falha ao adicionar o usuário, tente novamente.");
            		}
   				 });
            },
            error: function(error) {
                res.send(404, "evento (" + req.params.id + ") não encontrado ou já expirado :(");
            }
        });
};

exports.events = function(req, res) {
 
  var event_author = req.body.who;
  var event_title = req.body.what;
  var event_info = req.body.info;

  var Events = Parse.Object.extend("Events");
  var e = new Events();
  e.set('author', event_author);
  e.set('title', event_title);
  e.set('info', event_info);
  e.set('guests', []);

  e.save(null, {
            success: function(post) {
                // The post was saved successfully.
                console.log("success" + e.id);
                res.render('event_share',{ user:event_author,eventId:e.id} );
            },
             error: function(error) {
                res.send(404, "falha ao criar o evento, tente novamente.");
            }
   });

};
