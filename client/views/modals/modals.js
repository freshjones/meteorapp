


Template.model.events({
	  'click .submit' : function(event)
	  {
		 event.preventDefault();
		 
		 //switch the status from pending to active
		 //$('input[name="status"]').val('active');		

		 var data = formJSON();
		 
		 data.status = 'active';

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
	  'click .cancel' : function(event)
	  {

			event.preventDefault();

	  },
	  'click #addMilestone' : function(event)
	  {
		
		event.preventDefault();

		var thisAction = $('input[name="action"]').val();

		if(thisAction == 'insert')
		{

			var data = formJSON();
			var thisID = new Meteor.Collection.ObjectID();

			var milestone = {};

			milestone = formJSONByClass('.modal-group', 'milestone');
			milestone.id = thisID;
			
			data.milestones = [milestone];

			Projects.insert( data );

		} else {

			var data = formJSONByClass('.modal-group', 'milestone');
			var thisID = new Meteor.Collection.ObjectID();
	
			data.id = thisID;
		 
			Projects.update( {"_id": this.id }, { $push : { 'milestones' : data } });
		}
		
		 
	  },
	  'click .pull-remove' : function(event)
	  {
		 event.preventDefault();

		 var thisRecord = $("#modalForm input[name='id']").val();
		 
		 Projects.update( {"_id" : thisRecord }, { $pull : {  'milestones' : { "id": this.id } } } );
		 
	  }
  

  });

