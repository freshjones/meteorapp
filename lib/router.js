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
	
	this.route('settings', {
		path: '/settings',
		waitOn: function(){ return App.subs.settings; },
		data:function(){
			
			 var allSettings = Settings.find();
			 var mySettings = {};
			  
			 mySettings.units = 'weeks';
			 mySettings.duration = 2;
			 mySettings.weekends = 'yes';

			 $.map(allSettings.collection.docs, function(n, i){
				  
				  switch(n['key']) { 
				  
				  	case 'units':
				  		mySettings.units = n['value'];
				  	break;
				  	
				  	case 'duration':
				  		mySettings.duration = n['value'];
				  	break;

				  	case 'weekends':
				  		mySettings.weekends = n['value'];
				  	break;
				  	
				  	case 'hoursperday':
				  		mySettings.hoursperday = n['value'];
				  	break;
				  	
				  }
				  
			});
			  
			return {
				settings : mySettings
			}
		},
		controller: 'ActionController',
		action: 'show'	
	});
	
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
	
	/*
	this.route('oldschedules', {
		path: '/schedules',
		waitOn: function(){ return App.subs.settings; },
		data: function() {
			var iterationLength = getDuration();
			
			return { 
				title : "Schedules",
				length : iterationLength,
				theads : iterationDays,
				tfeatures : iterationFeatures( iterationLength, iterationDays),
				tfoot : colTotals( iterationLength ) 
			}
		}
	});
	*/
	this.route('schedules', {
		path: '/schedules',
		waitOn: function(){ return [ App.subs.sprints, App.subs.features, App.subs.schedules ] },
		data:function(){

			var duration = getDuration();
			var sprintData = [];
			
			
			Sprints.find({}).forEach( function(doc){
				
				var sprintObject = {};
				var hours_per_resource = hoursPreResource();
				var hoursPerDay = getSetting('hoursperday', 6);
				var iterationDays = iterationDates( doc.iteration.start, duration );
				
				var scheduleData = hasSchedule(doc._id);
				var userDayTotals = {};
				
				doc.iteration.iterationDays = iterationDays;
				
				sprintObject['_id'] = doc._id;
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
					
					var featureTotal = 0;
					
					var feature_user_id = feature._id + "_" + thisUser;
					
					if(scheduleData)
					{
						featureTotal = scheduleData['featureusertotals'][feature_user_id];
					}
						
					if(featureTotal === undefined || isNaN(featureTotal) )
					{
						featureTotal = 0;
					}
					
					if(thisUser in userCounts == false){
						userCounts[thisUser] = {};
						userCounts[thisUser]['_id'] 					= thisUser;
						userCounts[thisUser]['name'] 					= thisUser;
						userCounts[thisUser]['count'] 					= 0;
						userCounts[thisUser]['hoursperday']				= hoursPerDay;
						userCounts[thisUser]['billablecount'] 			= 0;
						userCounts[thisUser]['hoursperresource'] 		= hours_per_resource;
						userCounts[thisUser]['featureTotal'] 			= featureTotal;
					}
					
					userCounts[thisUser]['count'] += userCount;
					
					if(thisBillable && thisBillable === 'yes')
					{
						userCounts[thisUser]['billablecount'] += userCount;
					}
					
				});
				
				
				//get user day totals
				
				userDayTotals.days = [];
				
				iterationDays.forEach(function(eachDay){
					
					var this_user_day_obj = {};
					
					this_user_day_obj.day = eachDay.time;
					this_user_day_obj.users = [];
					
					var userCount = 1;
					for (var items in userCounts)
					{
						
						var user_id = userCounts[items]['_id'];
						
						var this_user_day_id = user_id + "_" + eachDay.time;
						
						var thisVal = 0;
						
						if(scheduleData)
						{
							thisVal = scheduleData['userdaytotals'][this_user_day_id];
						}
						
						if( thisVal === undefined || isNaN(thisVal) )
						{
							thisVal = 0;
						}
						
						this_user_day_obj.users.push({'_id' :  user_id, 'num': userCount, 'user_day_total' : thisVal});
						
						userCount++;
						
					}
					
					userDayTotals.days.push(this_user_day_obj);
					
				});
					
				
				
				
				sprintObject['userDayTotals'] = userDayTotals;
				
				sprintObject['userCounts'] = [];
				
				var userCount = 1;
				for (var items in userCounts)
				{
					userCounts[items].num = userCount;
					sprintObject['userCounts'].push(userCounts[items]);
					userCount++;
				};
				
				sprintObject.iteration.userCount = sprintObject['userCounts'].length;
				
				sprintData.push(sprintObject);
				
				console.log(sprintData);
				
			});
			
			return {
				sprintList : sprintData
			}
			
		},
		controller: 'ActionController',
		action: 'show'	
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