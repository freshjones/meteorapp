Template.inbox.events({

	'click .view': function (event) {
		event.preventDefault();
		Router.go('inboxitem', { _id : this._id });
  	},
	'click .remove': function (event) {
		event.preventDefault();
		Inbox.remove({_id:this._id});
  	},
	'click .process': function (event) {
		event.preventDefault();
		Router.go('inboxprocess', { _id : this._id });
  	}

});