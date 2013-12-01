Template.requests.events({

	'click .view': function (event) {
		event.preventDefault();
		Router.go('request', { _id : this._id });
  	},
	'click .edit': function (event) {
		event.preventDefault();
		Router.go('request', { _id : this._id });
  	},
	'click .remove': function (event) {
		event.preventDefault();
		Requests.remove({_id:this._id});
  	},
	'click .process': function (event) {
		event.preventDefault();
		alert('process');
  	}

});