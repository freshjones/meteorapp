Router.map(function() { 
	
	this.route('quotes',{
		path: '/quotes',
	    controller: 'QuotesController',
	    action: 'show',
	});
	
	this.route('quote',{
		path: '/quote/:_id',
	    controller: 'QuoteController',
	    action: 'show',
	});
	
	
});
