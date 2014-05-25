/*jslint node: true */
'use scrict';

var config = require('./config'); 

var Parse = require('parse').Parse;
Parse.initialize(config.keyApp,config.keyJS);

Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}; 

exports.triggerEvents = function() {

 var query = new Parse.Query('Events');
 query.ascending('createdAt'); // os mais antigos primeiro

 query.limit(20);
 
 query.find({
  success: function(events) {
    for (var i = 0; i < events.length; i++) {
      // This does not require a network access.
      //console.log(events[i].createdAt <= events[i].createdAt.addHours(30));
      console.log('----');
      console.log(events[i].createdAt);
      console.log(events[i].createdAt.addHours(30));
      if ((events[i].createdAt <= events[i].createdAt.addHours(30)) === false) { // while createAt < 30 
       events[i].destroy({
        success: function(myObject) {
    			// The object was deleted from the Parse Cloud.
    			console.log('-- deleted id' + myObject.id);
       },
       error: function(myObject, error) {
    			// The delete failed.
    			// error is a Parse.Error with an error code and description.
    			console.log('-- fail --' + myObject.id );
        }
      });
     }    
   }
 }
});

}; 

exports.index = function(req, res){
  res.render('index', { title: '' });
  //console.log(req.body); 
};

exports.add = function(req, res){
  var d = new Date();
  var today = d.getDate();
  var month = d.getMonth() + 1; // january is 0
  res.render('add', { date: 'Ex.: amanhã, dia ' + today + '/'+ month });
};

exports.eventsId = function(req, res) {

 var query = new Parse.Query('Events');
 query.get(req.params.id, {
  success: function(object) {
                 //console.log("success");
                 /* mostrar quem esta indo */
                 
                 //res.send(200,"o evento existe :-) " + object.get("author"));

 res.render('event', {event_author:object.get('author'), 
   event_title:object.get('title'), 
   event_info:object.get('info'),
   event_id:object.id,
   event_guests:object.get('guests')});

},
error: function(error) {
  res.send(404, 'evento (' + req.params.id + ') não encontrado ou já expirado :(');
}
});

  // Fun fact: this has security issues
};


/* POST */
exports.guests = function(req, res, next) {

 var event_id = req.originalUrl.split('/')[2];

 var query = new Parse.Query('Events');
 query.get(event_id, {
  success: function(object) {
   console.log('success');
   /* mostrar quem esta indo */
   object.addUnique('guests',req.body.guestname);

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
   res.send(404, 'falha ao adicionar o usuário, tente novamente.');
 }
});
 },
 error: function(error) {
  res.send(404, 'evento (' + req.params.id + ') não encontrado ou já expirado :(');
}
});
};

exports.events = function(req, res) {

  var event_author = req.body.who;
  var event_title = req.body.what;
  var event_info = req.body.info;

  var Events = Parse.Object.extend('Events');
  var e = new Events();
  e.set('author', event_author);
  e.set('title', event_title);
  e.set('info', event_info);
  e.set('guests', []);

  e.save(null, {
    success: function() {
                // The post was saved successfully.
                //console.log("success" + e.id);
                res.render('event_share',{ user:event_author,eventId:e.id} );
              },
              error: function() {
                res.send(404, 'falha ao criar o evento, tente novamente.');
              }
            });

};
