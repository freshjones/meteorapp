Template.viewQuoteOverview.events({
	
	'click .accountType': function (event) 
	{
		
  		var thisType = $(event.currentTarget).val();
  		
  		
  		switch(thisType)
  		{
  			case 'new':
  				$('#newClientFields').show();
  				$('#existingClientFields').hide();
  			break;
  			
  			case 'existing':
  				$('#newClientFields').hide();
  				$('#existingClientFields').show();
  			break;
  		
  		}
  		
  		
  		//$("#ff-client").val($("#ff-client option:first").val());
  		
  		//Session.set('accountType', thisType);
  		//Session.set('customer', undefined);
  	},
  	
  	
	
});

Template.existingClientFields.events({
	
	'change #ff-client': function (event) 
	{
  		var code = $(event.currentTarget).val();
  		Session.set('selectedAccount', code);
  		$("#ff-customer").val($("#ff-customer option:first").val());
  	},
  	
});


Template.viewQuoteOverview.rendered = function() {

	/*
	var data = this.data;

	if(data.quote.accountdetails !== undefined)
	{	
		
		var thisType = data.quote.accountdetails.accountType;
		
		switch(thisType)
  		{
  			case 'new':
  				$("#newclient").prop('checked', true);
  				$('#newClientFields').show();
  				$('#existingClientFields').hide();
  			break;
  			
  			case 'existing':
  				$("#existingclient").prop('checked', true);
  				$('#newClientFields').hide();
  				$('#existingClientFields').show();
  			break;
  		
  		}
		
	}
	*/
}