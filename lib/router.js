Router.configure ({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
});

Router.before
(
	function()
	{
		if(!Meteor.userId())
		{
			this.redirect('login');
		} 
	}, 
	{
		except: ['login', 'forgotPassword', 'addrequest', 'sendemail']
	}
);

Router.map(function() { 
	
	this.route('home', {
		path: '/',
		controller: 'ActionController',
		action: 'show'
	});
	
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
					
					//push userCounts
					var userCount = 0;
					var thisUserID = thisFeature.assign;
					var thisBillable = thisFeature.billable;
					
					var thisUser = Meteor.users.findOne(thisUserID);
						
					thisFeature.assignedName = thisUser.profile.name;
					
					userCount += thisFeature.estimate;
					
					if(thisUserID in userCounts == false){
						userCounts[thisUserID] = {};
						userCounts[thisUserID]['name'] 						= thisUser.profile.name;
						userCounts[thisUserID]['count'] 					= 0;
						userCounts[thisUserID]['billablecount'] 			= 0;
						userCounts[thisUserID]['hoursperresource'] 		= hours_per_resource;
					}
					
					userCounts[thisUserID]['count'] += userCount;
					
					if(thisBillable && thisBillable === 'yes')
					{
						userCounts[thisUserID]['billablecount'] += userCount;
					}
					
					sprintObject['features'].push(thisFeature);
					
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
		waitOn: function(){ return [ App.subs.settings] },
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
	
	
	this.route('users', {
		path: '/settings/users',
		waitOn: function(){ return App.subs.users; },
		data:function(){
			return { 
				
				userList : Meteor.users.find({}, {sort: {username: 1}}) 
				
			}
		},
		controller: 'ActionController',
		action: 'show'	
	});
	
	this.route('user', {
		path: '/settings/user/:_id',
		controller: 'UserController',
		action: 'show'	
	});
	
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
	    path: '/client/:_id',
	    controller: 'ClientController',
		action: 'show'
	});
	
	this.route('schedules', {
		path: '/schedules',
		waitOn: function(){ return [ App.subs.sprints, App.subs.features, App.subs.schedules ] },
		data:function(){

			var duration = getDuration();
			var sprintData = [];
			var roundtonearest = 10;
			
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
				
				doc.features.forEach(function(feature)
				{
					
					//push features
					var thisFeature = Features.findOne(feature._id);
					
					//push userCounts
					var userCount = 0;
					var thisUserID = thisFeature.assign;
					var thisBillable = thisFeature.billable;
					var thisUser = Meteor.users.findOne(thisUserID);
					
					thisFeature.assignedName = thisUser.profile.name;
					
					userCount += thisFeature.estimate;
					
					if(thisUserID in userCounts == false){
						userCounts[thisUserID] = {};
						userCounts[thisUserID]['_id'] 					= thisUserID;
						userCounts[thisUserID]['name'] 					= thisUser.username;
						userCounts[thisUserID]['count'] 				= 0;
						userCounts[thisUserID]['hoursperday']			= hoursPerDay;
						userCounts[thisUserID]['billablecount'] 		= 0;
						userCounts[thisUserID]['hoursperresource'] 		= hours_per_resource;
					}
					
					userCounts[thisUserID]['count'] += userCount;
					
					if(thisBillable && thisBillable === 'yes')
					{
						userCounts[thisUserID]['billablecount'] += userCount;
					}
					
					sprintObject['features'].push(thisFeature);
					
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
						
						if(scheduleData['userdaytotals'])
						{
							thisVal = scheduleData['userdaytotals'][this_user_day_id];
						}
						
						if( thisVal === undefined || isNaN(thisVal) )
						{
							thisVal = 0;
						} else {
							
							thisVal = Math.round( thisVal * roundtonearest ) / roundtonearest;
						}
						
						this_user_day_obj.users.push({'_id' :  user_id, 'num': userCount, 'user_day_total' : thisVal});
						
						userCount++;
						
					}
					
					userDayTotals.days.push(this_user_day_obj);
					
				});
					
				var featureCounter = 0;
				//we need to make the feature by user totals as well
				doc.features.forEach(function(feature) {
					
					//user totals just by both day and feature
					
					var user_feature_day_totals = [];
					
					if('userdaytotals' in sprintObject['features'][featureCounter] == false )
					{
						sprintObject['features'][featureCounter].userdaytotals = [];
					}
					
					iterationDays.forEach(function(eachDay){
						
						var thisDayObj = {};
						
						thisDayObj.day = eachDay.time;
						thisDayObj.dayUsers = [];
						
						var userCounter = 1;
						for (var items in userCounts)
						{
							var thisUserObj = {};
							thisUserObj._id = userCounts[items]['_id'];
							thisUserObj.num = userCounter;
							
							var thisKey = feature._id + "_" + eachDay.time + "_" + userCounts[items]['_id'];
							
							var thisVal = 0;
							
							if(scheduleData['featureuserdaytotals'] )
							{
								thisVal = scheduleData['featureuserdaytotals'][thisKey];
							}
							
							if( thisVal === undefined || isNaN(thisVal) )
							{
								thisVal = 0;
								
							} else {
								
								thisVal = Math.round(thisVal * roundtonearest ) / roundtonearest;
							}
							
							thisUserObj.count = thisVal;
							
							thisDayObj.dayUsers.push(thisUserObj);
							userCounter++;
						}
						
						user_feature_day_totals.push(thisDayObj);
						
					});
					
					sprintObject['features'][featureCounter].userdaytotals = user_feature_day_totals;
					
					
					/* -------------------------------------- */
					
					//user totals just by feature
					
					var usertotals = [];
					
					if('usertotals' in sprintObject['features'][featureCounter] == false )
					{
						sprintObject['features'][featureCounter].usertotals = [];
					}
					
					var userCount = 1;
					
					for (var items in userCounts)
					{
						var user_id = userCounts[items]['_id'];
						
						var this_feature_user_id = feature._id + "_" + user_id;
						
						var thisVal = 0;
						
						if(scheduleData['featureusertotals'])
						{
							thisVal = scheduleData['featureusertotals'][this_feature_user_id] ;
						}
						
						if( thisVal === undefined || isNaN(thisVal) )
						{
							thisVal = 0;
						} else {
							
							thisVal = Math.round(thisVal * roundtonearest ) / roundtonearest;
							
						}
						
						usertotals.push({'_id' : this_feature_user_id, 'feature_user_total' : thisVal});
						
						userCount++;
						
					}
					
					sprintObject['features'][featureCounter].usertotals = usertotals;
					
					featureCounter++;
					
				});
				
				
				sprintObject['userDayTotals'] = userDayTotals;
				
				sprintObject['userCounts'] = [];
				
				var userCount = 1;
				for (var items in userCounts)
				{
					userCounts[items].count = Math.round(userCounts[items].count * roundtonearest ) / roundtonearest;
					userCounts[items].num = userCount;
					sprintObject['userCounts'].push(userCounts[items]);
					userCount++;
				};
				
				sprintObject.iteration.userCount = sprintObject['userCounts'].length;
				
				sprintData.push(sprintObject);
				
			});
			
			//console.log(sprintData);
			
			return {
				sprintList : sprintData
			}
			
		},
		controller: 'ScheduleController',
		action: 'show'	
	});

	this.route('team', {
		path: '/team',
		waitOn: function() { return [ App.subs.sprints, App.subs.features, App.subs.schedules ] },
		data:function(){

			var returnObj = {};

			var today = Date.today();

			var weekStart = today.clone().previous().monday();
			var weekEnd = weekStart.clone().addDays(5);

			returnObj.today = today.toString("dddd, MMM dd");
			returnObj.weekStart = weekStart.toString("MMM, dd");
			returnObj.weekEnd = weekEnd.toString("MMM, dd");
			
			//lets get the sprint that fits today
			thisSprint = Sprints.findOne({'_id':'92JvNizKWWmtqtvrY'});

			//console.log(thisSprint._id  );

			//once we have an iteration we can grab the schedule that goes with it
			thisSchedule = Schedules.findOne({'iteration_id':thisSprint._id});
			
			console.log(thisSchedule);
			
			var myFeatureObj = [];

			thisSprint.features.forEach(function(feature){

				var thisFeature = Features.findOne({'_id':feature._id});
				if(thisFeature.assign === 'Kristen')
				{
					myFeatureObj.push(thisFeature);
				}
				
			});
			
			//userdaytotals
			
			returnObj.features = myFeatureObj;

			//console.log(returnObj);
			//returnObj.features = Features.find({'assign':'Billy'}, { status:{"pending":0} } );
			
			return returnObj;

		},
		controller: 'ActionController',
		action: 'show'	
	});
	
	
	this.route('myaccount',{
	    controller: 'AccountController',
	    action: 'show',
	});
	
	
	
	/* inbox */
	
	this.route('inbox',{
		path: '/inbox',
	    waitOn: function() { return [ App.subs.inbox ] },
	    data:function(){
	    	var inboxData = {};
	    	inboxData.items = Inbox.find({status:"active"}).fetch();
	    	return inboxData;
	    },
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('inboxitem',{
		path: '/inbox/:_id',
	    controller: 'InboxItemController',
	    action: 'show',
	});
	
	this.route('inboxprocess',{
		path: '/inbox/:_id/process/:type?/:action?',
	    controller: 'InboxProcessController',
	    action: 'show',
	});
	
	
	
	/* sales */
	
	this.route('sales',{
		path: '/sales/:inbox?',
		waitOn: function () 
		{
			return Meteor.subscribe('sales');
		},
	    data:function(){
	    	
			var salesData = {};
			
			var inbox = 'active';
				
			if(this.params.inbox != undefined)
			{
				switch(this.params.inbox)
				{
					case 'verify':
						inbox = 'verify';
					break;
					
					case 'prospect':
						inbox = 'prospect';
					break;
					
					case 'clarify':
						inbox = 'clarify';
					break;
					
					case 'opportunity':
						inbox = 'opportunity';
					break;
					
					case 'purchase':
						inbox = 'purchase';
					break;
					
				}
				
			} 
	    	
			salesData.inbox = inbox;
			salesData.items = Sales.find({status:inbox}).fetch();
	    	
	    	return salesData;
	    	
	    },
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('salesprocess',{
		path: '/sales/:inbox/:_id/process/:action?/:type?',
		template: 'salesprocess',
	    controller: 'SalesProcessController',
	    action: 'show',
	});
	
	this.route('leads',{
		path: '/sales/leads',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('contracts',{
		path: '/sales/contracts',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('quotes',{
		path: '/sales/quotes',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	
	/* service */
	
	this.route('service',{
		path: '/service/:inbox?',
		waitOn: function () 
		{
			return Meteor.subscribe('service');
		},
	    data:function(){
	    	
	    	var serviceData = {};
	    	
	    	var inbox = 'active';
			
			if(this.params.inbox != undefined)
			{
				switch(this.params.inbox)
				{
					case 'quote':
						inbox = 'quote';
					break;
					
					case 'support':
						inbox = 'support';
					break;
					
					case 'problem':
						inbox = 'problem';
					break;
				}
				
			} 
	    	
			serviceData.inbox = inbox;
	    	serviceData.items = Service.find({status:inbox}).fetch();
	    	return serviceData;
	    },
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('serviceprocess',{
		path: '/service/:inbox/:_id/process/:action?/:type?',
		template: 'serviceprocess',
	    controller: 'ServiceProcessController',
	    action: 'show',
	});
	
	this.route('requests',{
		path: '/service/requests',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('support',{
		path: '/service/support',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('problems',{
		path: '/service/problems',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('preventive',{
		path: '/production/preventive',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	
	/* production */
	
	this.route('production',{
		path: '/production',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('backlog',{
		path: '/production/backlog',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('allsprints',{
		path: '/production/scheduled',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	this.route('sprintplanning',{
		path: '/production/planning',
	    controller: 'ActionController',
	    action: 'show',
	});
	
	
	/* operations */
	
	this.route('operations',{
		path: '/operations',
		data:function(){
	    	var inboxData = {};
	    	inboxData.items = Inbox.find({},{status:{"active":1}});
	    	return inboxData;
	    },
	    controller: 'ActionController',
	    action: 'show',
	});
	

	
});





