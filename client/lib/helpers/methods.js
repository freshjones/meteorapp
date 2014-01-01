clearPendingProjects = function()
{
	 Meteor.call("clearPending", thisCollection, function(error,result){
	    if(error){
	        console.log(error.reason);
	    }
	    else{
	      
	      
	    }
	});

};

