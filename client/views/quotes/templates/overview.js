Template.viewQuoteOverview.events({
	
	'click .accountType': function (event) 
	{
  		var thisType = $(event.currentTarget).val();
  		
  		Session.set('accountTypeSelected', thisType);
  	},
	
});

Template.viewQuoteOverview.helpers({

	newAccount : function()
	{
		if( Session.get('accountTypeSelected') === 'new')
		{
			return true;
		} else {
			return false;
		}
	},
	existingAccount : function()
	{
		if( Session.get('accountTypeSelected') === 'existing')
		{
			return true;
		} else {
			return false;
		}
	}
	
	
});

