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
		
		switch(whichModal)
		{
		
			case 'backlog':
				var templateName = "modal-feature";
			break;
			
			case 'project':
				var templateName = "modal-project";
			break;
		}
		
		var fragment = Meteor.render( function() {
		   return Template[ templateName ](); // this calls the template and returns the HTML.
		});
		
		$('#myModal .modal-body').html( fragment );
		
	});
	
}

