
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
		
		var quoteData = {};
		
		quoteData.quote = Quotes.findOne( this.params._id );
		
		quoteData.view = true;
    	
    	if(this.params.view == undefined)
		{
    		quoteData['viewSummary'] = true;
    		
		} else {
			
    		var thisView = 'view' + this.params.view;
    		quoteData[thisView] = true;
		}
    	
    	quoteData.action = false;
    	
    	if(this.params.action != undefined)
		{
    		quoteData.action = true;
    		var thisAction = 'action' + this.params.action;
    		quoteData[thisAction] = true;
		} 
    	
    	quoteData.estvalue = 0;
    	
    	if( quoteData.quote.estModel === 'instinct')
    	{
    		quoteData.estvalue = quoteData.quote.instinctEstimate;
    	} else {
    		
    		if( quoteData.quote.features )
        	{
    			
    			var featureSum = getFeatureSum( quoteData.quote.features, 0 );
    			
    			if(featureSum > 0 )
    			{
    				quoteData.estvalue = featureSum;
    			}
    			
        	}
    		
    	}
    	
		return quoteData;
		
	},
	show: function () {
		this.render();
	}

});

QuoteApprovalController = RouteController.extend({
	  
	waitOn: function () 
	{
		var codeLength = this.params._approvalcode.length;
		var quote_id = this.params._approvalcode.substring(0,codeLength-8); 
		
	    return [ Meteor.subscribe('quote', quote_id) ];
	},
	data:function() {
		
		var codeLength 		= this.params._approvalcode.length;
		var quote_id 		= this.params._approvalcode.substring(0,codeLength-8); 
		var approval_id 	= this.params._approvalcode.substring(codeLength-8); 
		
		var quoteData = {};
		
		quoteData.quote = Quotes.findOne({'_id':quote_id, 'approvalCode':approval_id});
		
		var showApprovalForm = false;
		
		if(quoteData.quote != undefined)
		{
			showApprovalForm = true;
		}
		
		quoteData.showForm = showApprovalForm;
		
		return quoteData;
		
	},
	show: function () {
		this.render();
	}

});