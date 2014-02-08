Router.map(function() { 
	
	this.route('clients', {
		path: '/clients',
		waitOn: function(){ return App.subs.clients; },
		data:function(){
			return {
				clientList : Clients.find({'status':{ $ne: 'pending'} })
			}
		},
		controller: 'ActionController',
		action: 'show'	
	});

	this.route('client',{
	    path: '/client/:_id?',
	    controller: 'ClientController',
		action: 'show'
	});
	
});

	