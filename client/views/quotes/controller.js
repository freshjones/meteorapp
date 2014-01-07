
QuotesController = RouteController.extend({
	  
	waitOn: function () 
	{
	    return [ Meteor.subscribe('quotes') ];
	},
	data:function() {
		
		var quoteData = {};
		
		quoteData.items = Quotes.find({status:'review'});
		
		return quoteData;
		
		
	},
	show: function () {
		this.render();
	}

});	  

QuoteController = RouteController.extend({
	  
	waitOn: function () 
	{
	    return [ Meteor.subscribe('quote', this.params._id) ];
	},
	data:function() {
		
		return Quotes.findOne( this.params._id );
		
	},
	show: function () {
		this.render();
	}

});