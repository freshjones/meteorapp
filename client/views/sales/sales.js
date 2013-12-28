Template.sales.events({

	'click .remove': function (event) {
		event.preventDefault();
		Sales.remove({_id:this._id});
  	},
	'click .process': function (event) {
		event.preventDefault();
		var thisInbox = Router.current().params['inbox'];
		Router.go('salesprocess', { inbox:thisInbox, _id : this._id });
  	}

});

Template.salesNav.events({
	
	'click .inbox': function (event) {
		
		event.preventDefault();
		
		var to = $(event.currentTarget).attr('data-action');
  		
		Router.go('sales', {  inbox:to });
  		
  	}
	
});
