Router.map(function() { 
	
	this.route('quotes',{
		path: '/quotes',
	    controller: 'QuotesController',
	    action: 'show',
	});
	
	this.route('newquote',{
		path: '/quote/new/:_id?/:view?/:type?',
	    controller: 'NewQuoteController',
	    action: 'show',
	});
	
	this.route('quoteaction',{
		path: '/quote/response/:_approvalcode',
		layoutTemplate: 'quoteResponse',
		template: 'quoteAction',
	    controller: 'QuoteApprovalController',
	    action: 'show',
	});
	
	this.route('quote',{
		path: '/quote/:_id/:view?/:action?',
	    controller: 'QuoteController',
	    action: 'show',
	});
	
	
});
