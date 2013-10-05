//Currently selected project
Session.setDefault('client_id', null);

//When editing project, ID of the project
Session.setDefault('editing_client', null);

Template.clients.events({

	'click #newClient': function (event) {
		event.preventDefault();
		var newClient = Clients.insert({status:"pending", estimate:0, order:9999 });
		Session.set('client_id', newClient);
		//Deps.flush();
		Session.set('showModal', true);
  	},
	'click .edit': function (event) {
		event.preventDefault();
		//Session.set('client_id', this._id);
		//Session.set('showModal', true);
		Router.go('client', { _id : this._id });
  	},
	'click .remove': function (event) {
		event.preventDefault();
		Clients.remove({_id:this._id});
		//Session.set('project_id', this._id);
		//Deps.flush();
		//Session.set('showModal', true);
  	}, 
  	'click .close, click .modal-backdrop, click .close-modal ': function (event) {
		event.preventDefault();
		Session.set('client_id', null);
		 // Deps.flush();
		//ditch the record if not needed
		if(this.status === 'pending')
		{
			Clients.remove({_id:this._id});
		}
		Session.set('showModal', false);
	}, 
  	'click button.submit ': function (event) {
  		event.preventDefault();
  		var data = formJSON();
		data.status = 'active';
		Clients.update( {_id:this._id }, { $set : data } );
  		//close the modal
  		Session.set('showModal', false);
	}

});