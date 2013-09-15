crudEvents = function(thisCollection)
{
	console.log(thisCollection.toLowerCase());
	return {
	  'click .remove' : function(event)
	  {
		  eval(thisCollection).remove( this._id );
	  },
	  'click .edit' : function(event)
	  {
		var thisID = this._id;  
		var thisDocument = eval(thisCollection).findOne({"_id" : thisID });
		var formAction = 'update';
		var modalTitle = "Update " + thisCollection;
	  	var fragment = Meteor.render( function() {
	  		var tempName = "modal-" + (thisCollection).toLowerCase();
		   return Template["modal-clients"]({ isUpdate : true, id : thisID, action : 'update', values: thisDocument }); // this calls the template and returns the HTML.
		});
		
		$('#myModal #myModalLabel').html( modalTitle );
		$('#myModal .modal-body').html( fragment );
		$('#myModal').modal('show');
		$('#action').val(formAction);

	  }
	}
};