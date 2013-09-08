curPath=function(){
	var c=window.location.pathname;
	var b=c.slice(0,-1);
	var a=c.slice(-1);
	if(b==""){return"/"}
	else{ 
		if(a=="/"){
			return b
		}else{
			return c
		}
	}
};

Handlebars.registerHelper('active', function(path) {
    return curPath() == path ? 'active' : '';
});

var fixHelper = function(e, ui) {
	ui.children().each(function() {
		$(this).width($(this).width());
	});
	return ui;
};

Template.backlog.rendered = function() {
	
	$("#sortable tbody").sortable({
		helper: fixHelper,
		placeholder: "ui-state-highlight",
		start: function (event, ui) {
	        ui.placeholder.html('<td colspan="5">&nbsp;</td>');
	    },
	}).disableSelection();
		


}

Template.model.rendered = function() {

	$('#myModal').on('shown', function () {

		var estimate_array = [0, .1, .3, .5, 1, 3, 5, 10, 30, 50];

		function estimateSliding(event,ui)
		{
		    //update the amount by fetching the value in the value_array at index ui.value
		    $('#estimate-label').html( estimate_array[ui.value] ); 
		    $('#estimate').val( estimate_array[ui.value] ); 
		}
		
		$('#slider').slider({ min:0, max:estimate_array.length - 1, slide: estimateSliding});
		
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

