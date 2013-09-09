
	var numDays = 14;
	var i;
	
	var grid = {};
	grid.times = [];
	
	for(i=0; i<numDays; i++)
	{
		grid.times[i] = moment().add('d', i).format("MM/DD/YY"); 
	}

	Template.current.grid = function(){
		  
	   return grid;
	    
	};

	Template.current.rendered = function() 
	{
		var calWidth 	= $('.calHeaderDates').width();
		var calHeight	= $('.calHeaderDates').height();
		
		$(".calHeader").each(function()
			{
				$(this).height( calWidth ).width( calHeight );
			});
		
	}
	