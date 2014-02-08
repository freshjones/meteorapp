/*
ClientController = RouteController.extend({
  
  template: 'client',

  waitOn: function () {
    return Meteor.subscribe('clients', this.params._id);
  },
  data: function () {
	  
	  var thisID = this.params._id;
	  
	  var thisClient = Clients.findOne(thisID);
	  
    return {
    	client : thisClient,
    	projects : Projects.find({'client':thisClient.code})
    }
    
  },
  show: function () {
	  
	  this.render();
	  
  }
  
});
*/

ClientController = RouteController.extend({
	
	waitOn: function () 
	{
		return Meteor.subscribe('clients', this.params._id);
	},
	before: function () 
	{
		if(this.params._id == undefined)
		{
			var newclient_id = createTempClient();
			this.redirect('client', {_id:newclient_id} );
		} 
	},
	data:function() {
		
		var clientData = {};
		
		clientData = Clients.findOne( this.params._id );
			
		return clientData;
		
	},
	show: function () {
		this.render();
	}
	

});


var createTempClient = function()
{
	
	var newClientDraft = {};
	
	newClientDraft.status = 'draft';
	
	//now lets add the new item and redirect to it
	var draft_id = Clients.insert(newClientDraft);
	
	return draft_id;
	
}