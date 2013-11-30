ActionController = RouteController.extend({

  show: function () 
  {
	
	Session.set('showModal', false);
	this.render();
	
  }

});

ScheduleController = RouteController.extend({

  show: function () {
		
	var hoursperday = getSetting('hoursperday', 6);
	 
	//set hours per day accurately
	Session.set('hoursperday', hoursperday);
	
	//set showmodal to null
	Session.set('showModal', false);
	this.render();
    
  }

});

AccountController = RouteController.extend({

    path: '/myaccount',
    waitOn: function () {
    	return App.subs.users;
	},
	data: function () {
		var thisUser = Meteor.user();
	    return thisUser;
	},
    show: function () {
		this.render();
    }
});


UserController = RouteController.extend({
  
  template: 'user',

  waitOn: function () {
    return Meteor.subscribe('users', this.params._id);
  },

  data: function () {
	  
	var thisID = this.params._id;  
	var thisUser = Meteor.users.findOne(thisID);
    
    return thisUser;
    
  },
  
  show: function () 
  {
	  
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
  
  show: function () 
  {
	  this.render();
  }
  
});