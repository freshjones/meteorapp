Template.viewQuoteDeadlines.rendered = function() {
	
	$(".date").datepicker({ autoclose: true, format: 'mm-dd-yyyy' });
	
	if ( $("#flot-2").length > 0) {

		var d1 = [];
		for (var i = 0; i < 14; i += 0.5) {
			d1.push([i, Math.sin(i)]);
		}

		var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

		// A null signifies separate line segments

		var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];

		$.plot("#flot-2", [ d1, d2, d3 ]);
    }
	
}

Template.viewQuoteDeadlines.events({
	
	'click .addMilestone': function (event) 
	{
		
		event.preventDefault();
		
		var thisItem = this.quote;
		
  		formData = {};
  		formData.feature_id			= $('#milestoneFeature').val();
  		formData.title				= $('#milestoneFeature option:selected').text();
		formData.phase_id		 	= $('#milestonePhase').val();
		formData.phase		 		= $('#milestonePhase option:selected').text();
		formData.date		 		= $('#milestoneDate').val();
		formData.deliverable 		= $('#milestoneDeliverable').val();
		
		if(formData.feature_id.length != 0 && formData.phase_id.length != 0)
		{
			
			var milestones = [];
			
			if( this.quote.milestones != undefined)
			{
				milestones = milestones.concat( this.quote.milestones );
			}
			
			milestones.push(formData);
			
			Quotes.update( {_id:this.quote._id }, { $set : { 'milestones' : milestones } } );
	  		
			$("#milestoneFeature option:first").attr('selected','selected');
			$("#milestonePhase option:first").attr('selected','selected');
			$(".date").remove();
			
		} else {
			
			var message;
			
			message = 'please select a feature and a phase first';
			
			bootbox.alert(message);
			
		}
		
  	},
  	
  	
});

	
  

