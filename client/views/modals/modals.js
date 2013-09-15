


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
		 		eval(whichCollection).update( {"_id": submitData.id }, { $set : data } );
			break;
			
		 	case 'remove':
		 		eval(whichCollection).remove({"_id": submitData.id });
			break;
			 
		 }
		 
		 $('#myModal').modal('hide');
		 
	  },
	  'click #addMilestone' : function(event)
	  {
		 event.preventDefault();
		 var data = formJSONByClass('.modal-group', 'milestone');
	
		 var thisID = new Meteor.Collection.ObjectID();
	
		 data.id = thisID;
		 
		 Projects.update( {"_id": this.id }, { $push : { 'milestones' : data } });
		 
	  },
	  'click .pull-remove' : function(event)
	  {
		 event.preventDefault();
		 
		 var thisRecord = $("#modalForm input[name='id']").val();
		 
		 Projects.update( {"_id" : thisRecord }, { $pull : {  'milestones' : { "id": this.id } } } );
		 
	  }
  

  });

