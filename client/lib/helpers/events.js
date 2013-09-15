crudEvents = function(thisCollection)
{
	return {
	  'click .remove' : function(event)
	  {
		  eval(thisCollection).remove( this._id );
	  },
	  'click .edit' : function(event)
	  {
		  
		  $('#myModal').modal('show');
		  
		var thisID = this._id;  
		var thisDocument = eval(thisCollection).findOne({"_id" : thisID });
		var formAction = 'update';
		var modalTitle = "Update " + thisCollection;
		var modalData = {};
		var templateName = "modal-" + thisCollection.toLowerCase();
		
		switch(thisCollection.toLowerCase())
		{
			case 'projects':
				modalData.clientSelect = Clients.find();
			break;
		}
		
	  	var fragment = Meteor.render( function() {
	  		
		   return Template[templateName]({ isUpdate : true, id : thisID, action : 'update', values: thisDocument, data:modalData }); // this calls the template and returns the HTML.
		});
	  	
		$('#myModal #myModalLabel').html( modalTitle );
		$('#myModal .modal-body').html( fragment );
		$('#myModal').modal('show');
		$('#action').val(formAction);
		
	  }
	}
};

modalEvents = function()
{
	
	$('#myModal').on('shown', function () {
		
		var estimate_array = [0, .1, .3, .5, 1, 3, 5, 10, 30, 50];

		function estimateSliding(event,ui)
		{
		    //update the amount by fetching the value in the value_array at index ui.value
		    $('#estimate-label').html( estimate_array[ui.value] ); 
		    $('#estimate').val( estimate_array[ui.value] ); 
		}
		
		$('.dateFinder').datepicker({ format: 'mm-dd-yyyy'});
		
		$('#slider').slider
			(
				{ 
					min:0, 
					max:estimate_array.length - 1, 
					slide: estimateSliding,
					value: getSliderValue( estimate_array )
				}
			);
		
	}).on('hidden', function () {
		
		$('.datepicker').remove();
		
	});
	
	
	$('.modalButton').click(function(){
		
		var whichModal =  $(this).attr('id');
		var modalTitle = '';
		var formAction = 'insert';
		var isUpdate = false;
		var modalData = {};
		
		switch(whichModal.toLowerCase())
		{
			case 'backlog':
				var templateName = "modal-feature";
				modalTitle = 'Feature';
			break;
			
			case 'projects':
				var templateName = "modal-projects";
				modalTitle = 'Project';
				modalData.clientSelect = Clients.find();
			break;
			
			case 'clients':
				var templateName = "modal-clients";
				modalTitle = 'Clients';

			break;
		}
		
		var fragment = Meteor.render( function() {
		   //return Template[ templateName ](); // this calls the template and returns the HTML.
		   return Template[ templateName ]({ 'isUpdate' : isUpdate, action : 'insert', values: null, data: modalData }); //
		});
		
		$('#myModal #myModalLabel').html( modalTitle );
		$('#myModal .modal-body').html( fragment );
		$('#action').val(formAction);
		
	});
	
}