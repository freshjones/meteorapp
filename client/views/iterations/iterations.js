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

Template.iterations.helpers({

    grid: function(){
        return Session.get('settingsLoaded') ? 'awesome': 'not cool';
    }

    /*
    var settingsLoaded = Session.get('settingsLoaded');

    console.log('no settings loaded');

    if(settingsLoaded)
    {
        console.log('yeah settings are loaded');  
    }
    */

});

	
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
