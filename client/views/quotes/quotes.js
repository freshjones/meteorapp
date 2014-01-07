Template.quotes.events({

	'click .quoteitem': function (event) 
	{
  		event.preventDefault();
  		
  		Router.go('quote', { _id : this._id } );
  		
  	},

});