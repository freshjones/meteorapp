/*
var okCancelEvents = function(selector, callbacks) {

  var ok      = callbacks.ok || function() {};
  var cancel  = callbacks.cancel || function() {};
  var events  = {};

  events['keyup ' + selector + ', keydown ' + selector + ', focusout '+ selector ] = 
  
  function(evt) {

    if(evt.type === "keydown" && evt.which === 27) {

        cancel.call(this.evt);

    } else if (evt.type === "keyup" && evt.which === 13){

      var value = String(evt.target.value || "");

      if(value) {
        ok.call(this, value, evt);
      }
      else {
        cancel.call(this, evt);
        
      }

    }

  };

  return events;

}
*/

if(Meteor.isClient) {
	
	Meteor.startup(function() {
	    Session.set('data_loaded', false); 
	}); 
	
	Meteor.subscribe('default_db_data', function(){
		Session.set('data_loaded', true); 
	});
	
}

if(Meteor.isServer) {
    Meteor.publish('default_db_data', function(){
        this.ready();
        return Settings.find({});
    });
}