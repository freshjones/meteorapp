Template.clients.events({

  	'click .createItem': function (event) 
	{
  		event.preventDefault();
  		Router.go('client');
  	},
	'click .updateItem': function (event) {
		event.preventDefault();
		Router.go('client', { _id : this._id });
  	}
});


