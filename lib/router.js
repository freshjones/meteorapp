Router.configure ({
	layout: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
});

Router.map(function() { 
	
	this.route('home', {path: '/'});
	
	this.route('projects', {
		path: '/projects',
		waitOn: function(){ return [ App.subs.clients, App.subs.projects] },
		data:function(){
			return {
				projectsList : Projects.find({'status':{ $ne: 'pending'} })
			}
		},
		controller: 'ActionController',
		action: 'show'
	});
	
	
	this.route('sprints', {
		path: '/sprints',
		waitOn: function(){ return [ App.subs.projects, App.subs.features ] },
		data:function(){
			return {
				featureList : Features.find({'status':{ $ne: 'pending'} }, {sort:{order:1}})
			}
		},
		controller: 'ActionController',
		action: 'show'	
	});
	
	this.route('settings', {path: '/settings'});
	
	this.route('clients', {
		path: '/clients',
		waitOn: function(){ return App.subs.clients; },
		data:function(){
			return {
				clientList : Clients.find()
			}
		}
	});

	this.route('schedules', {
		path: '/schedules',
		waitOn: function(){ return App.subs.settings; },
		data: function() {
			var iterationLength = getDuration();
			var iterationDays = iterationDates( iterationLength );
			return { 
				title : "Schedules",
				length : iterationLength,
				theads : iterationDays,
				tfeatures : iterationFeatures( iterationLength, iterationDays),
				tfoot : colTotals( iterationLength ) 
			}
		}
	});
});

ActionController = RouteController.extend({

  show: function () {
	  
	//set showmodal to null
	Session.set('showModal', false);
	this.render();
    
  }

});
