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
		waitOn: function(){ return [ App.subs.settings, App.subs.projects, App.subs.features ] },
		data:function(){
			
			//var settingDuration = Settings.findOne({key:"duration"});
			//var settingUnits = Settings.findOne({key:"duration"});
			//var durationVal = settingDuration.value;
			//var daysinweek = 5;
			
			var hoursinday = 6;
			var numresources = 1;
			
			/* duration = num days in the sprint */
			var duration = getDuration();
			
			/* potentialhours are the amount of hours available for the team to use */
			var potentialhours = ( duration * hoursinday) * numresources;
			
			/* features are all the active features that need to be completed */	
			var features = Features.find({'status':{ $ne: 'pending'} }, {sort:{order:1}}).fetch();
			
			/* total estimate for all features */
			var estimatedHours = 0;
			features.forEach(function (doc) { estimatedHours += parseFloat(doc.estimate); }); 
		
			/* now we can divide total estimates by total potential to get num sprints required */
			var numSprints = 0;
			
			if(potentialhours > estimatedHours)
			{
				numSprints = 1
			} else {
				numSprints = Math.ceil(estimatedHours / potentialhours);
			}
			
			//now we now the number of sprints needed lets build an array to print them out
			//sprintData = sprintDates(numSprints, duration);
			
			/*
			sprintData.forEach(function (doc) {
				doc.features = [];
			});
			*/
			//console.log(potentialhours);
			var hourCount=0;
			var curSprint=0;
			var i=0;
			//lets loop through and place features in their respective sprint
			features.forEach(function (doc) {
				
				var thisEstimate = parseInt(doc.estimate);
				
				hourCount += thisEstimate;
				//console.log("hour count = " + hourCount);
				if(hourCount > potentialhours)
				{
					hourCount=thisEstimate;
					curSprint++;
				}
				
				features[i].iteration = curSprint;
				i++;
			});
			
			return {
				featureList : features
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
				clientList : Clients.find({'status':{ $ne: 'pending'} })
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
