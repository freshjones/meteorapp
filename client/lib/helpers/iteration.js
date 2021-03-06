getDuration = function()
{

	var units = getSetting('units', 'weeks');
	var duration = getSetting('duration', 2);
	var showWeekends = getSetting('weekends', 'yes');

	weekends = 0;

	if(showWeekends === 'no')
	{
		weekends = 2;
	}

	 switch(units)
	 {
	 	case 'weeks':
	 	default:
	 		var unit = 7 - weekends;
	 	break;
	 	
	 	case 'months':
	 		var unit = 30 - (weekends * 4)
	 	break;
	 	
	 	case 'days':
	 		var unit = 1;
	 	break;
		 
	 }

	 var length = duration * unit;
	 
	 return length;
	 
}

iterationDates = function(startDate, duration)
{
	var i;
	var data 		= [];
	var showWeekends = getSetting('weekends', 'yes');
	var dayCounter  = 0;
	
	for(i=0; i<duration; i++)
	{

		var start 		= Date.parse(startDate); //Date.today().previous().monday();

		var thisDay 	= start.addDays(dayCounter);

		var thisDayNum 	= thisDay.getDay();

		if(showWeekends === 'no' && thisDayNum==5)
		{
			dayCounter = dayCounter + 2;
		} 

	    //data[i] = { time : moment().add('d', i).format("MM-DD-YY") };
	    data[i] = { 
	    			time : thisDay.toString("MM-dd-yy"),
	    			day : thisDayNum

	    			};

	    dayCounter++;
	}

	return data;
}

sprintDates = function(iterations, duration)
{
	var i;
	var data 		= [];
	for(i=0; i<iterations; i++)
	{
		var start 		= Date.today().previous().monday();
		var thisDay 	= start.addDays(duration*i);
		
		data[i] = { 
    				start : thisDay.toString("MM-dd-yy"),
    				end : thisDay.addDays(duration-1).toString("MM-dd-yy")
    			};
	}
	return data;
}

iterationFeatures = function(duration, days)
{
	var numFeatures = 10;
	var data 		= [];
	var i;

	for(i=0; i<numFeatures; i++)
	{
		
		thisFeature = "feature - " + i;

		var obj = {}

		obj.feature = thisFeature;
		obj.key = i;
		obj.data = [];

		var j;

		for(j=0; j<duration; j++)
		{
	    	obj.data[j] = { key : j, value : 0, day : days[j].day };
		}
		
		data.push(obj);
		 
	}
	//console.log(data);

	return data;

}

colTotals = function(duration)
{
	var i;
	var data 		= [];
	
	for(i=0; i<duration; i++)
	{
	    data[i] = { "key" : i, "value" : 0 };
	}

	return data;

}

calculateRow = function(cell)
{
	var thisRow = $(cell).parent();
	
	var totalCount = 0;

	thisRow.children('td.hour-cell').each(function(i){
		
		var thisVal = $(this).find('span').text();
			
		if( thisVal && !isNaN(thisVal) ) { 
			
			totalCount +=	parseFloat(thisVal); 
			
		}
		
	});
	
	updateRowTotalCell(thisRow, Math.round(totalCount * 10) / 10 );
	
}

calculateColumn = function( cell ) { 
	
	var totalCount = 0;
	var thisColumn;
	var thisClass = $(cell).attr('class');
	var classArray = thisClass.split(" ");
	
	$(classArray).each(function(i){
		var thisClass = classArray[i];
		if( thisClass.substring(0, 6) === 'column' )
		{
			thisColumn = thisClass;
		}
	});

	if(thisColumn.length)
	{
		
		$('td.' + thisColumn ).each(function(i){
			
			var thisVal = $(this).find('span').text();
			
			if( Math.floor(thisVal) == thisVal && $.isNumeric(thisVal)) { 
				
				totalCount += parseInt(thisVal); 
			}
			
		});
		
		updateColumnTotalCell(thisColumn, totalCount);
		
	}
	
}

updateColumnTotalCell = function(column, total)
{
	$('td.' + column + '-total').text(total);
}

updateRowTotalCell = function(row, total)
{
	$(row).find('.sprint-total').text(total);
}

getSequentialNumber = function(type)
{

	var curSequenceDoc = Sequentials.findOne({'type':type});

  	var newSequence = curSequenceDoc.value + 1;

  	Sequentials.update({'_id':curSequenceDoc._id}, {$set:{'value':newSequence}});

  	return newSequence;

}