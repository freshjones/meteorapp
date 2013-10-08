//Template.iterations.my = function() {

    /*
    var settingsLoaded = Session.get('settingsLoaded');

    console.log('no settings loaded');

    if(settingsLoaded)
    {
        console.log('yeah settings are loaded');  
    }
    */

//};

Template.schedules.events({

	'click #interation-hours span': function (event) {
	
		var thisItem = $(event.currentTarget);
		
		var e = thisItem.parent();

        var parentWidth = e.width();
        var parentHeight = e.height();
        
        if($(e).hasClass('hour-cell') ) {
        	e.addClass('active');
            var val = parseFloat(thisItem.html());
            e.html('<input type="text" value="'+val+'" class="hour-cell" style="width:' + parentWidth + 'px; height:' + parentHeight + 'px;" />');
            var newE = e.find('input');
            newE.select();
        }
        newE.on('blur', function() {
        	var thisTD = $(this).parent();
        	thisTD.html('<span>'+$(this).val()+'</span>').removeClass('active');

        	calculateRow( thisTD );
        	//calculateColumn( thisTD );
            
        });
        
  	},
  	
  	'click .level-schedule': function (event) {
  		
  		autolevel(this);
  		
  	}
  	
});

Template.schedules.helpers({
	
	/*
    grid: function(){
        return Session.get('settingsLoaded') ? 'awesome': 'not cool';
    }

    
    var settingsLoaded = Session.get('settingsLoaded');

    console.log('no settings loaded');

    if(settingsLoaded)
    {
        console.log('yeah settings are loaded');  
    }
    */

});

	
Template.schedules.rendered = function() 
{
	 /*
	 $( ".draggable" ).draggable({
		 start: function() { $(this).addClass('dragging'); },
		 stop: function() { $(this).removeClass('dragging'); }
	 });
	 */
	
	 /*
	 $( "#droppable" ).droppable({
		 drop: function( event, ui ) {
			 $( this )
			 .addClass( "ui-state-highlight" )
			 .find( "p" )
			 .html( "Dropped!" );
		 }
	 });
	*/
	/*
	$('#interation-hours').on('click', 'span', function() {
        
    });
	*/
}
