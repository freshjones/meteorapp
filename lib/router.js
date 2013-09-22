Router.configure ({
	layout: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
});

Router.map(function() { 
	
	this.route('home', {path: '/'});
	
	this.route('projects', {
		path: '/projects',
		waitOn: function(){ return [ App.subs.allclients, App.subs.allprojects] },
		data:function(){
			var project_id = Session.get('project_id');
			return {
				projectsList : Projects.find({'status':{ $ne: 'pending'} })
			}
		}
	});
	
	
	this.route('backlog', {path: '/backlog'});
	this.route('settings', {path: '/settings'});
	
	this.route('clients', {
		path: '/clients',
		waitOn: function(){ return App.subs.allclients; },
		data:function(){
			return {
				clientList : Clients.find()
			}
		}
	});

	this.route('iterations', {
		path: '/iterations',
		waitOn: function(){ return App.subs.blah; },
		data: function() {
			var iterationLength = getDuration();
			var iterationDays = iterationDates( iterationLength );

			return { 
				title : "my title",
				length : iterationLength,
				theads : iterationDays,
				tfeatures : iterationFeatures( iterationLength, iterationDays),
				tfoot : colTotals( iterationLength ) 
			}
		}
	});
});