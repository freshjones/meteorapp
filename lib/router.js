Router.configure ({
	layout: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
});

Router.map(function() { 
	this.route('home', {path: '/'});
	this.route('projects', {path: '/projects'});
	this.route('backlog', {path: '/backlog'});
	this.route('settings', {path: '/settings'});
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