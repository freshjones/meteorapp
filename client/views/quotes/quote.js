Template.quote.events({

	'click .back': function (event) 
	{
  		event.preventDefault();
  		
  		Router.go('quotes');
  		
  	},
  	'click .step': function (event) 
	{
  		event.preventDefault();
  		
  		var thisStep = $(event.currentTarget).attr('data-action');
  		
  		Router.go('quote', {_id:this.quote._id}, {query: { 'view' : thisStep } });
  		
  	},
  	'click .action': function (event) 
	{
  		event.preventDefault();
  		
  		var thisAction = $(event.currentTarget).attr('data-action');
  		
  		Router.go('quote', {_id:this.quote._id}, {query: { 'view' : 'Summary', 'action' : thisAction } });
  		
  	},
  	'click .cancelAction': function (event) 
	{
  		event.preventDefault();
  		Router.go('quote', {_id:this.quote._id}, {query: { 'view' : 'Summary' } });
  		
  	},
  	'click .submitAction': function (event) 
	{
  		event.preventDefault();
  		
  		var thisAction = $(event.currentTarget).attr('data-action');
  		
  		var quoteData = {};
  		
  		quoteData.quote_id        = this.quote._id;
  		quoteData.quotenum		    = this.quote.quotenum;
  		quoteData.to 			        = $('#sendTo').val();
  		quoteData.subject 		    = $('#sendSubject').val();
  		quoteData.coverletter     = $('#sendCoverLetter').val();
  		
  		Meteor.call("addOutgoing", 'quotes', quoteData, function(error,result){
  		    if(error){
  		        console.log(error.reason);
  		    }
  		    else{
  		    	console.log(result);
  		    }
  		});
  		
  	},
  	

});