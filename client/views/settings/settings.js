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
	    	
	    	$.map(formArray, function(n, i){
	        	
	        	var thisVal = n['value'];
	        	if( Math.floor(thisVal) == thisVal && $.isNumeric(thisVal)) { thisVal = parseInt(thisVal); }
	        	var thisObj = {key : n['name'], value : thisVal};
	        	Settings.insert(thisObj);
	        });
	    	
	    	//we need to rebuild iterations as well
	    	rebuildSprints(true);
	    	
	    }
	});
	
  }

});