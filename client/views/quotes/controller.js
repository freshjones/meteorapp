
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



NewQuoteController = RouteController.extend({
	
	waitOn: function () 
	{
		return [ 
		         	Meteor.subscribe('quote', this.params._id),
		         	Meteor.subscribe('clients', this.params._id),
		         	Meteor.subscribe('quotetemplates'),
	            	Meteor.subscribe('sequentials'),
	            	Meteor.subscribe('accountReps'),
	            ];
	},
	before: function () 
	{
		
		$(".date").remove();
		
		if(this.params._id == undefined)
		{
		
			var newquote_id = createTempQuote();
			
			this.redirect('newquote', {_id:newquote_id} );
			
			//we are creating a new quote
			//Session.set('accountType', undefined);
			//Session.set('selectedAccount', '');
			
			/*
			if( Session.get('clientType') !== undefined )
			{
				Session.set('clientType', undefined);
			}
			*/
			
		} 
	},
	data:function() {
		
		var quoteData = {};
		
		quoteData.quote = Quotes.findOne( this.params._id );
		
		quoteData.clientlist = Clients.find({}).fetch();
		
		quoteData.view = true;
    	
    	if(this.params.view == undefined)
		{
    		quoteData['viewOverview'] = true;
    		
		} else {
			
    		var thisView = 'view' + this.params.view;
    		quoteData[thisView] = true;
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
    	
    	quoteData.estvalue = Math.round(quoteData.estvalue * 100 ) / 100;
    	
    	var estTotal = quoteData.estvalue * 125;
    	
    	if( quoteData.quote.extra )
    	{
    		if(quoteData.quote.extra.includeEnv)
        	{
        		estTotal += estTotal * (quoteData.quote.extra.valueEnv / 100);
        	}
        	
        	if(quoteData.quote.extra.includeConcept)
        	{
        		estTotal += estTotal * (quoteData.quote.extra.valueConcept / 100);
        	}
        	
        	if(quoteData.quote.extra.includePM)
        	{
        		estTotal += estTotal * (quoteData.quote.extra.valuePM / 100);
        	}
        	
        	if(quoteData.quote.extra.includeConfig)
        	{
        		estTotal += estTotal * (quoteData.quote.extra.valueConfig / 100);
        	}
        	
        	if(quoteData.quote.extra.includeTesting)
        	{
        		estTotal += estTotal * (quoteData.quote.extra.valueTesting / 100);
        	}
        	
        	if(quoteData.quote.extra.includeDeploy)
        	{
        		estTotal += estTotal * (quoteData.quote.extra.valueDeploy / 100);
        	}
        	
        	if(quoteData.quote.extra.includeTraining)
        	{
        		estTotal += estTotal * (quoteData.quote.extra.valueTraining / 100);
        	}
        	
        	if(quoteData.quote.extra.includeUnForeseen)
        	{
        		estTotal += estTotal * (quoteData.quote.extra.valueUnForeseen / 100);
        	}
    	}
    	
    	quoteData.quote.estTotal = Math.round(estTotal * 100 ) / 100;

    	quoteData.quotetemplates = QuoteTemplates.find({status:'active'}).fetch();
    	
    	quoteData.featurelist = getFeatureList( quoteData.quote.features );
    	
    	
    	/* CLIENT TYPE */
    	/*
    	quoteData.newClient 		= false;
    	quoteData.existingClient 	= false;
    	
    	if(quoteData.quote.accountdetails !== undefined)
    	{
    		
    		var clientType = quoteData.quote.accountdetails.accountType;
    		
    	}
    	
    	if(clientType === 'new')
    	{
    		quoteData.newClient = true;
    	}
    	
    	if(clientType === 'existing')
    	{
    		quoteData.existingClient = true;
    		
    		if(quoteData.quote.accountdetails === undefined)
        	{
    			var custCode = Session.get('customer');
    		
        	} else {
        		
        		var custCode = quoteData.quote.accountdetails.code;
        		
        	}
    			
    		quoteData.customerList = [];
    		
    		if( custCode !== undefined && custCode.length )
    		{
    			quoteData.custCode = custCode;
    			quoteData.selectedCustomer = Clients.findOne({'code':custCode});
    		}
    		
    	}
    	
    	
    	quoteData.selectedCustomer = {};
    	
    	if(quoteData.quote.accountdetails.account !== undefined)
    	{
    		
    		quoteData.selectedCustomer = Clients.findOne({ 'code':quoteData.quote.accountdetails.account });
    		
    	}
    	*/
    	
    	if(Session.get('selectedAccount') === undefined && quoteData.quote.accountdetails.account !== undefined)
    	{
    		Session.set('selectedAccount', quoteData.quote.accountdetails.account);
    	}
    	
    	var selectedAccount = Session.get('selectedAccount');
    	
    	quoteData.selectedCustomerList = {};
    	
    	if( Session.get('selectedAccount') !== undefined )
    	{
    		quoteData.selectedCustomerList = Clients.findOne({'code':selectedAccount}).contacts;
    	}
    	
    	/* USERS */
    	quoteData.accountReps = Meteor.users.find({}).fetch();
    	
    	return quoteData;
		
	},
	show: function () {
		
		this.render();
	},

});

var getFeatureList = function( data )
{
	
	var featureList = [];
	
	if(data != undefined)
	{
		
		data.forEach(function (doc) { 
			
			var thisItem = {};
			
			thisItem._id = doc.feature_id;
			thisItem.type = doc.type;
			
			var prefix = '';
			
			switch(doc.type)
			{
				case 'feature':
					prefix = '----';
				break;
				
				case 'minor':
					prefix = '--';
				break;
			}
			
			thisItem.title = prefix + doc.title.trim();
			
			
			featureList.push(thisItem);
			
			if(doc.children != undefined && doc.children.length)
			{
				var children = getFeatureList( doc.children );
				featureList = featureList.concat(children);
			} 
			
		});
		
	
	}

	return featureList;
	
}

var createTempQuote = function()
{
	
	var newQuoteDraft = {};
	
	newQuoteDraft.status = 'draft';
	
	//now lets add the new item and redirect to it
	var draft_id = Quotes.insert(newQuoteDraft);
	
	return draft_id;
	
}