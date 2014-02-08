Template.viewQuoteOverview.events({
	
	'click .accountType': function (event) 
	{
  		event.preventDefault();
  		
  		var thisType = $(event.currentTarget).val();
  		
  		Session.set('accountType', thisType);
  		
  	},
  	'change #ff-client': function (event) 
	{
  		event.preventDefault();
  		
  		var code = $(event.currentTarget).val();
  		
  		Session.set('customer', code);
  		
  	},
  	
	
});