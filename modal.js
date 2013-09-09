if (Meteor.isClient) {

  Template.model.events({
	  'click .submit' : function(event)
	  {
		 event.preventDefault();
		 
		 var data = formJSON();
		 
		 //since we will use this shell for all forms we ned to pull a bit of data
		 var submitData = getSubmitData();
		 var whichCollection = submitData.collection;
		 var whichAction = submitData.action;
		 
		 switch(whichAction)
		 {
		 	case 'insert':
		 		eval(whichCollection).insert( data );
			break;
			 
		 	case 'update':
		 		eval(whichCollection).update( {"_id": submitData.id }, data );
			break;
			
		 	case 'remove':
		 		eval(whichCollection).remove({"_id": submitData.id });
			break;
			 
		 }
		 
		 $('#myModal').modal('hide');
		 
	  }
  
  });
  
  
}

