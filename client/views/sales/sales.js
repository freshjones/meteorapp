Template.sales.events({

	'click .remove': function (event) {
		event.preventDefault();
		Sales.remove({_id:this._id});
  	},
	'click .process': function (event) {
		event.preventDefault();
		Router.go('salesprocess', { _id : this._id });
  	}

});