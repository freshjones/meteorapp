Handlebars.registerHelper('whichAccountChosen', function() {
	
	var selectedAccount = Session.get('selectedAccount');
			
	var returnval = '';
	if(this.code === selectedAccount)
	{
		returnval = 'selected="selected"';
	}
	return returnval;
});

Handlebars.registerHelper('whichCustomerChosen', function() {
	
	var selectedCustomer = Session.get('selectedCustomer');
	
	var returnval = '';
	
	if(this.email === selectedCustomer)
	{
		returnval = 'selected="selected"';
	}
	
	return returnval;
	
});

Handlebars.registerHelper('whichSelectedRep', function() {
	
	var selectedRep = Session.get('selectedRep');
	
	var returnval = '';
	
	if(this._id === selectedRep)
	{
		returnval = 'checked="checked"';
	}
	
	return returnval;
	
});


