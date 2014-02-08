Handlebars.registerHelper('selectedAccount', function(custcode) {
	var returnval = '';
	if(this.code === custcode)
	{
		returnval = 'selected="selected"';
	}
	return returnval;
});