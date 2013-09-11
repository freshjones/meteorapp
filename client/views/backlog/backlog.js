Template.backlog.myfeatures = function(){
	  
   return Features.find({}, {sort: {order: 1}});
    
  };

Template.backlog.events({
	  
	  'click .remove' : function(event)
	  {
		  Features.remove( this._id );
	  },
	  'click .edit' : function(event)
	  {
		  
		var thisDocument = Features.findOne({"_id" : this._id });
		  
	  	var fragment = Meteor.render( function() {
		   return Template[ "modal-feature-update" ](thisDocument); // this calls the template and returns the HTML.
		});
		
		$('#myModal .modal-body').html( fragment );
		
		$('#myModal').modal('show');
			
	  }
  
});
  
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