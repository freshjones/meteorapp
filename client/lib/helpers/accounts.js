Handlebars.registerHelper('selectedAccount', function() {
	
	var selectedAccount = Session.get('selectedAccount');
			
	var returnval = '';
	if(this.code === selectedAccount)
	{
		returnval = 'selected="selected"';
	}
	return returnval;
});

Handlebars.registerHelper('selectedCustomer', function(customer) {
	var returnval = '';
	if(this.email === customer)
	{
		returnval = 'selected="selected"';
	}
	return returnval;
});

