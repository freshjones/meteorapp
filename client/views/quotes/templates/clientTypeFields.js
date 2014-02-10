
Template.existingClientFields.events({
	
	'change #ff-client': function (event) 
	{
  		var code = $(event.currentTarget).val();
  		
  		if(code.length)
  		{
  			Session.set('selectedAccount', code);
  		} else {
  			Session.set('selectedAccount', undefined);
  		}
  		
  		$("#ff-customer").val($("#ff-customer option:first").val());
  		
  	},
  	'change #ff-customer': function (event) 
	{
  		
  		var customer = $(event.currentTarget).val();
  		
  		if(customer.length)
  		{
  			Session.set('selectedCustomer', customer);
  		} else {
  			Session.set('selectedCustomer', undefined);
  		}
  		
	}
  	
});

Template.existingClientFields.helpers({
	
	accountList: function() {
		return Clients.find({}).fetch();
	},
	selectedAccount: function() {
		return Session.get('selectedAccount');
	},
	customerList: function() {
		
		if( Session.get('selectedAccount') !== undefined )
		{
			
			var selectedAccount = Session.get('selectedAccount');
			
			return Clients.findOne({'code':selectedAccount}).contacts;
			
		}
		
	},
	selectedCustomer: function() {
		return Session.get('selectedCustomer');
	},
	
});


Template.newClientFields.helpers({

	accountDetails: function()
	{
		return Session.get('accountDetails');
	}

});

Template.accountRepFields.helpers({

	accountReps : function()
	{
		return Meteor.users.find({}).fetch();
	},
	selectedRep : function()
	{
		return Session.get('selectedRep');
	}

});
