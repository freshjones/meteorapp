Template.settings.settings = function(){
	  
  var allSettings = Settings.find();
  var mySettings = {};
  
  mySettings.units = 'weeks';
  mySettings.duration = 2;
  mySettings.weekends = 'yes';

  $.map(allSettings.collection.docs, function(n, i){
	  
	  switch(n['key']) { 
	  
	  	case 'units':
	  		mySettings.units = n['value'];
	  	break;
	  	
	  	case 'duration':
	  		mySettings.duration = n['value'];
	  	break;

	  	case 'weekends':
	  		mySettings.weekends = n['value'];
	  	break;
	  	
	  }
	  
  });
  
  return mySettings;

};
	  
Template.settings.events({
  
  'click .submit' : function(event)
  {
	 event.preventDefault();
	 
	var form = $('#settingsForm .form-val');
	var formArray = form.serializeArray();
    
	var dataArray = [];
	
	
	Meteor.call("clearSettings", function(error,result){
	    if(error){
	        console.log(error.reason);
	    }
	    else{
	    	console.log(result);
	    }
	});
	
	
	$.map(formArray, function(n, i){
    	
    	var thisVal = n['value'];
    	
    	if( Math.floor(thisVal) == thisVal && $.isNumeric(thisVal)) { thisVal = parseInt(thisVal); }
    	
    	var thisObj = {key : n['name'], value : thisVal};
    	
    	Settings.insert(thisObj);
    	
    });
	
  }

});