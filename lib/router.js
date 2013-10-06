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
	
	this.route('project',{
	    path: '/project/:_id',
	    controller: 'ProjectsController',
		action: 'show'
	});
	
	this.route('sprints', {
		path: '/sprints',
		waitOn: function(){ return [ App.subs.sprints, App.subs.features ] },
		data:function(){

			var sprintData = [];
			
			Sprints.find({}).forEach( function(doc){
				
				var sprintObject = {};
				
				var hours_per_resource = hoursPreResource();
				
				sprintObject['iteration'] = doc.iteration;
				
				if('features' in sprintData == false){
					sprintObject['features'] = []; 
    			}
				
				var userCounts = [];
				
				doc.features.forEach(function(feature){
					
					//push features
					var thisFeature = Features.findOne(feature._id);
					sprintObject['features'].push(thisFeature);
					
					//push userCounts
					var userCount = 0;
					var thisUser = thisFeature.assign;
					var thisBillable = thisFeature.billable;
					
					userCount += thisFeature.estimate;
					
					if(thisUser in userCounts == false){
						userCounts[thisUser] = {};
						userCounts[thisUser]['name'] 					= thisUser;
						userCounts[thisUser]['count'] 					= 0;
						userCounts[thisUser]['billablecount'] 			= 0;
						userCounts[thisUser]['hoursperresource'] 		= hours_per_resource;
					}
					
					userCounts[thisUser]['count'] += userCount;
					
					if(thisBillable && thisBillable === 'yes')
					{
						userCounts[thisUser]['billablecount'] += userCount;
					}
					
				});
				
				sprintObject['userCounts'] = [];
				
				for (var items in userCounts)
				{
					sprintObject['userCounts'].push(userCounts[items]);
				};
				
				sprintData.push(sprintObject);
				
			});
			
			return {
				sprintList : sprintData
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

	this.route('client',{
	    path: '/client/:_id',
	    controller: 'ClientController',
		action: 'show'
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

ProjectsController = RouteController.extend({
  
  template: 'project',

  waitOn: function () {
    return Meteor.subscribe('projects', this.params._id);
  },

  data: function () {
	  
	  var thisID = this.params._id;
	  
	  var thisProject = Projects.findOne(thisID);
	  
	  var milestones = _.map(thisProject.milestones || [], function (milestone) {
			return {project_id: thisID, milestone: milestone};
		});
	  
    return {
    	project : thisProject,
    	clientselect : Clients.find(),
    	milestone_items :  milestones
    }
    
  },

  show: function () {
    // render the RouteController's template into the main yield location
    this.render();
  }
});


ClientController = RouteController.extend({
  
  template: 'client',

  waitOn: function () {
    return Meteor.subscribe('clients', this.params._id);
  },

  data: function () {
	  
	  var thisID = this.params._id;
	  
	  var thisClient = Clients.findOne(thisID);
	  
    return {
    	client : thisClient,
    	projects : Projects.find({'client':thisClient.code})
    }
    
  },

  show: function () {
    // render the RouteController's template into the main yield location
    this.render();
  }
  
});

getBob = function() {

			var hoursinday = 6;
			var numresources = 2;
			
			/* duration = num days in the sprint */
			var duration = getDuration();

			var hours_per_resource = hoursinday * duration;

			//console.log(hours_per_resource);
			
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

			//console.log(potentialhours);
			var hourCount=0;
			var curSprint=0;
			var iterations = [];
			var userCounts = [];
			var i=0;
			var start,end;
			var showWeekends = getSetting('weekends', 'yes');
			var weekends = 0;
			
			if(showWeekends === 'no')
			{
				weekends = 2;
			} 
			
			//lets loop through and place features in their respective sprint
			features.forEach(function (doc) {
				
				var userCount = 0;
				var thisUser = doc.assign;
				var thisEstimate = parseFloat(doc.estimate);
				
				hourCount += thisEstimate;
				userCount += thisEstimate;
				
				//console.log("hour count = " + hourCount);
				if(hourCount > potentialhours)
				{
					hourCount=thisEstimate;
					curSprint++;
				}
				
				var whichIteration = curSprint; 

				if(whichIteration in iterations == false){
        			iterations[whichIteration] = {}; 
    			}
				
				if('iteration' in iterations[whichIteration] == false){
					
					var baseDate 	= Date.today().previous().monday();
					start 			= baseDate.addDays( (duration + weekends) *curSprint);
					end 			= start.clone().addDays(duration-1);
					
					startString 	= start.toString("MMM d, yyyy");
					endString		= end.toString("MMM d, yyyy")
					
        			iterations[whichIteration]['iteration'] = {}; 
        			iterations[whichIteration]['iteration']['start'] 			= startString;
        			iterations[whichIteration]['iteration']['end'] 				= endString;
        			iterations[whichIteration]['iteration']['startString'] 		= whichIteration === 0 ?  'Current' : startString;
        			iterations[whichIteration]['iteration']['endString'] 		= endString;
        			
    			}

				/* user counts */
				if(whichIteration in userCounts == false){
					userCounts[whichIteration] = {}; 
    			}
				
				if(thisUser in userCounts[whichIteration] == false){
					userCounts[whichIteration][thisUser] = {};
					userCounts[whichIteration][thisUser]['name'] 					= thisUser;
					userCounts[whichIteration][thisUser]['count'] 					= 0;
					userCounts[whichIteration][thisUser]['billablecount'] 			= 0;
					userCounts[whichIteration][thisUser]['hoursperresource'] 		= hours_per_resource;
				}
				    			
    			//console.log(thisUser + " - " + userCount);
				userCounts[whichIteration][thisUser]['count'] += userCount;
				
				if(doc.billable && doc.billable === 'yes')
				{
					userCounts[whichIteration][thisUser]['billablecount'] += userCount;
				}
    			
				var hourEstimated = Math.round(hourCount * 10 ) / 10;
				var hourWasted = Math.round((potentialhours - hourCount) * 10 ) / 10;
				var percentUtilization = Math.round( ( (hourEstimated / potentialhours) * 100) * 10 ) / 10;
				
				iterations[whichIteration]['iteration']['hoursUsed'] 			= hourEstimated;
				iterations[whichIteration]['iteration']['hoursNotUsed'] 		= hourWasted;
				iterations[whichIteration]['iteration']['percentUtilized'] 		= percentUtilization;
				
				
				if('features' in iterations[whichIteration] == false){
        			iterations[whichIteration]['features'] = []; 
    			}

    			iterations[whichIteration]['features'].push(doc);
    			
    			var order = parseInt("" + (whichIteration+1) + i);
    			
    			//we also have to update the feature order to keep track of where it is in iteration
    			Features.update( { "_id" : doc._id }, { $set : { "order" : order } } );
    			
    			//feature iterator
    			i++;
    			
			});

			i = 0;
			
			//here we can enter all the sprint data into the db
			
			//first lets wipe the sprint db since we rebuild each time 
			//depending on feature order etc.
			
			Meteor.call("clearSprints", function(error,result){
			    if(error){
			        console.log(error.reason);
			    }
			    else{
			    	console.log(result);
			    	
			    	//now we can rebuild the sprints
			    	//now we can add all new sprint data as needed
					iterations.forEach(function (doc) {
						
						var thisSprint = {};
						
						thisSprint['start'] = doc.iteration.start;
						thisSprint['end'] = doc.iteration.end;
						
						if('features' in thisSprint == false){
							thisSprint['features'] = [];
						}
						
						doc.features.forEach(function (thisFeature) {
							thisSprint['features'].push({_id : thisFeature._id });
						});
						
						//console.log(thisSprint);
						
						Sprints.insert(thisSprint);
						
						if('userCounts' in doc == false){
							doc.userCounts = [];
						}
						
						for (var items in userCounts[i] )
						{
							doc.userCounts.push(userCounts[i][items]);
						};
						
						i++;
						
					});
					
			    }
			    
			});

	return iterations;

}
