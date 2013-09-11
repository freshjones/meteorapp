	
	
 
	Template.iterations.grid = function() {

		 
			return {};
	};
	
	
	Template.iterations.rendered = function() 
	{
		
		$('#interation-hours').on('click', 'span', function() {
	        var e = $(this).parent();
	
	        var parentWidth = e.width();
	        var parentHeight = e.height();
	        
	        if($(e).hasClass('hour-cell') ) {
	        	e.addClass('active');
	            var val = $(this).html();
	            e.html('<input type="text" value="'+val+'" class="hour-cell" style="width:' + parentWidth + 'px; height:' + parentHeight + 'px;" />');
	            var newE = e.find('input');
	            newE.select();
	        }
	        newE.on('blur', function() {
	        	var thisTD = $(this).parent();
	        	thisTD.html('<span>'+$(this).val()+'</span>').removeClass('active');
	            
	        	calculateRow( thisTD );
	        	calculateColumn( thisTD );
	            
	        });
	    });
		
	}
	
	getDuration = function(duration,units)
	{

		 switch(units)
		 {
		 	case 'weeks':
		 	default:
		 		var unit = 7;
		 	break;
		 	
		 	case 'months':
		 		var unit = 30;
		 	break;
		 	
		 	case 'days':
		 		var unit = 1;
		 	break;
			 
		 }
		 
		 var length = duration * unit;
		 
		 return length;
		 
	}
	
	
	calculateRow = function(cell)
	{
		var thisRow = $(cell).parent();
		
		var totalCount = 0;
	
		thisRow.children('td.hour-cell').each(function(i){
			
			var thisVal = $(this).find('span').text();
			
			if( Math.floor(thisVal) == thisVal && $.isNumeric(thisVal)) { 
				
				totalCount += parseInt(thisVal); 
			}
			
		});
		
		updateRowTotalCell(thisRow, totalCount);
		
	}
	
	calculateColumn = function( cell ){
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
	