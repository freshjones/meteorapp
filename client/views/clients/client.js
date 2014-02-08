Template.client.events({

  	'click .back': function (event) 
	{
  		event.preventDefault();
  		Router.go('clients');
  	},
  	'click .createItem': function (event) 
	{
  		event.preventDefault();
  		Router.go('client');
  	},

});


Template.clientForm.events({
	
	'click .save': function (event) 
	{
  		event.preventDefault();
  		
  		var formData = {};
  		
  		formData.code 	= $('#account_code').val();
  		formData.name 	= $('#account_name').val();
  		formData.status = 'active';
  		
  		Clients.update( {_id:this._id }, { $set : formData } );
  		
  		Router.go('clients');
  		
  	}
	
	
});

Template.contactform.events({

	'click .addContact': function (event) 
	{
  		event.preventDefault();
  		
  		var formData = {};
  		
  		formData.fname 	= $('#contact_fname').val();
  		formData.lname 	= $('#contact_lname').val();
  		formData.email 	= $('#contact_email').val();
  		
  		var contacts = [];
		
		if( this.contacts != undefined)
		{
			contacts = contacts.concat( this.contacts );
		}
		
		contacts.push(formData);
		
		Clients.update( {_id:this._id }, { $set : { 'contacts' : contacts } } );
		
  	}

});