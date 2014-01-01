Template.service.events({

	'click .process': function (event) {
		event.preventDefault();
		var thisInbox = Router.current().params['inbox'];
		Router.go('serviceprocess', { inbox:thisInbox, _id : this._id });
  	},
  	'click .buildquote': function (event) {
		event.preventDefault();
		var thisInbox = Router.current().params['inbox'];
		Router.go('quotebuild', { inbox:thisInbox, _id : this._id });
  	},
  	
});

Template.serviceNav.events({
	
	'click .inbox': function (event) {
		event.preventDefault();
		var to = $(event.currentTarget).attr('data-action');
		Router.go('service', {  inbox:to });
  	}
	
});
