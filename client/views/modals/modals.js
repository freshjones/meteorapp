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

Template.model.rendered = function() {

	$('#myModal').on('shown', function () {

		var estimate_array = [0, .1, .3, .5, 1, 3, 5, 10, 30, 50];

		function estimateSliding(event,ui)
		{
		    //update the amount by fetching the value in the value_array at index ui.value
		    $('#estimate-label').html( estimate_array[ui.value] ); 
		    $('#estimate').val( estimate_array[ui.value] ); 
		}
		
		$('#slider').slider
			(
				{ 
					min:0, 
					max:estimate_array.length - 1, 
					slide: estimateSliding,
					value: getSliderValue( estimate_array )
				}
			);
		
	});
	
	$('.modalButton').click(function(){
		
		var whichModal =  $(this).attr('id');
		var modalTitle = '';
		
		switch(whichModal)
		{
			case 'backlog':
				var templateName = "modal-feature";
				modalTitle = 'Feature';
			break;
			
			case 'project':
				var templateName = "modal-project";
				modalTitle = 'Project';
			break;
			
			case 'client':
				var templateName = "modal-client";
				modalTitle = 'Client';
			break;
		}
		
		var fragment = Meteor.render( function() {
		   return Template[ templateName ](); // this calls the template and returns the HTML.
		});
		
		$('#myModal #myModalLabel').html( modalTitle );
		
		$('#myModal .modal-body').html( fragment );
		
	});
	
}