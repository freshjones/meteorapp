Template.backlog.myfeatures = function(){
	  
	return Features.find({}, {sort: {order: 1}});

};

Template.backlog.events = crudEvents('Features');
  
Template.backlog.rendered = function() {
	
	$("#sortable tbody").sortable({
		
	    handle: "td.move",
	    update: function( event, ui ) {
	    	$('.sortable-items .sortable-item').each(function(index){
	    		Features.update( { "_id" : $(this).attr('id') }, { $set : { "order" : index } } );
	    	});
	    }
	}).disableSelection();
		
}