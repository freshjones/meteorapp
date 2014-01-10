Router.map(function() { 
	
	this.route('quotes',{
		path: '/quotes',
	    controller: 'QuotesController',
	    action: 'show',
	});
	
	this.route('quote',{
		path: '/quote/:_id/:view?/:action?',
	    controller: 'QuoteController',
	    action: 'show',
	});
	
	this.route('quote/response',{
		path: '/quote/response:_approvalcode',
	    controller: 'QuoteController',
	    action: 'show',
	});
	
	
	
});
