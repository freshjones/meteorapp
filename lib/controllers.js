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


InboxItemController = RouteController.extend({
	  
	  template: 'inboxitem',

	  waitOn: function () {
	    return Meteor.subscribe('inbox', this.params._id);
	  },
	  data: function () {
		  var thisID = this.params._id;
		  var thisInboxItem = Inbox.findOne(thisID);
		  return thisInboxItem;
	  },
	  show: function () {
		  this.render();
	  }
	  
});

InboxProcessController = RouteController.extend({
	  
	  template: 'inboxprocess',

	  waitOn: function () {
	    return Meteor.subscribe('inboxitem', this.params._id);
	  },
	  data: function () {
		  
		  var returnData = {};
		  
		  var thisID = this.params._id;
		  var thisType = '';
		  
		  if(this.params.type != 'undefined')
		  {
			  thisType = this.params.type;
		  }
		  
		  returnData.thisInboxItem = Inbox.findOne(thisID);
		  returnData.summaryData = InboxProcessData.find({inbox_id:thisID}).fetch();

		  return returnData;
		  
	  },
	  show: function () {
		  this.render();
	  }
	  
});

SalesProcessController = RouteController.extend({
	  
	  waitOn: function () {
	    return [Meteor.subscribe('salesitem', this.params._id), Meteor.subscribe('sales')];
	  },
	  data: function () {
		  
		  var returnData = {};
		  
		  switch(this.params.inbox)
		  {
		  	case 'active':
		  		returnData.inboxActive = true;
		  	break;
		  	
		  	case 'verify':
		  		returnData.inboxVerify = true;
		  	break;
		  	
		  	case 'clarify':
		  		returnData.inboxClarify = true;
		  	break;
		  	
		  	case 'prospect':
		  		returnData.inboxProspect = true;
		  	break;
		  	
		  	case 'opportunity':
		  		returnData.inboxOpportunity = true;
		  	break;
		  	
		  	case 'purchase':
		  		returnData.inboxPurchase = true;
		  	break;
		  	
		  }
		  
		  var action 		= false;
		  
		  if(this.params.action != undefined)
		  {
			  switch(this.params.action)
			  {
			  	  	case 'new':
			  	  	default:
			  	  		action = 'new';
			  	  	break;
			  }
		  }
		  var showForm 			= false;
		  var leadForm 			= false;
		  var opportunityForm 	= false;
		  var purchaseForm 		= false;
		  var type 				= false;
		  
		  if(this.params.type != undefined)
		  {
			  
			  switch(this.params.type)
			  {
			  	  	case 'lead':
			  	  		showForm = true;
			  	  		leadForm = true;
			  	  		type = 'lead';
			  	  	break;
			  	  	
			  	  	case 'opportunity':
			  	  		showForm = true;
			  	  		opportunityForm = true;
			  	  		type = 'opportunity';
			  	  	break;
			  	  	
				  	case 'purchase':
				  		showForm = true;
				  		purchaseForm = true;
				  		type = 'purchase';
			  	  	break;
			  }
		  }
		  
		  var thisID = this.params._id;

		  returnData.thisInboxItem = Sales.findOne(thisID);
		  returnData.summaryData = salesProcessData.find({inbox_id:thisID}).fetch();
		  returnData.action = action;
		  returnData.type = type;
		  
		  returnData.showForm = showForm;
		  returnData.leadForm = leadForm;
		  returnData.opportunityForm = opportunityForm;
		  returnData.purchaseForm = purchaseForm;
		  
		  return returnData;
		  
	  },
	  show: function () {
		  this.render();
	  }
	  
});



ServiceProcessController = RouteController.extend({
	  
	  waitOn: function () {
	    return [Meteor.subscribe('serviceitem', this.params._id), Meteor.subscribe('service'), Meteor.subscribe('clients'), Meteor.subscribe('projects')];
	  },
	  data: function () {
		  
		  var returnData = {};
		  
		  switch(this.params.inbox)
		  {
		  
		  	case 'active':
		  		returnData.inboxActive = true;
		  	break;
		  	
		  	case 'quote':
		  		returnData.inboxQuote = true;
		  	break;
		  	
		  }
		  
		  var action 		= false;
		  
		  if(this.params.action != undefined)
		  {
			  switch(this.params.action)
			  {
			  	  	case 'new':
			  	  	default:
			  	  		action = 'new';
			  	  	break;
			  }
		  }
		  
		  var showForm 			= false;
		  var quoteForm 		= false;
		  var supportForm 		= false;
		  var problemForm 		= false;
		 
		  var type 				= false;
		  
		  if(this.params.type != undefined)
		  {
			  
			  switch(this.params.type)
			  {
			  	  	case 'quote':
			  	  		showForm = true;
			  	  		quoteForm = true;
			  	  		type = 'request';
			  	  	break;
			  	  	
			  	  	case 'support':
			  	  		showForm = true;
			  	  		supportForm = true;
			  	  		type = 'support';
			  	  	break;
			  	  	
				  	case 'problem':
				  		showForm = true;
				  		problemForm = true;
				  		type = 'problem';
			  	  	break;
			  }
		  }
		  
		  var company = false;
		  var projects = false;
		  
		  if(this.params.company != undefined)
		  {
			  company = this.params.company;
			  projects = Projects.find({client:company, status:'active'}).fetch();
		  }
		  
		  var thisID = this.params._id;
		  
		  returnData.thisInboxItem = Service.findOne(thisID);
		  returnData.summaryData = serviceProcessData.find({inbox_id:thisID}).fetch();
		  returnData.action = action;
		  returnData.type = type;
		  
		  returnData.showForm = showForm;
		  returnData.quoteForm = quoteForm;
		  returnData.supportForm = supportForm;
		  returnData.problemForm = problemForm;
		  returnData.company = company;

		  returnData.companies = Clients.find({code:{$exists:true}}, {code:1, name:1});
		  
		  returnData.projects = projects;
		  return returnData;
		  
	  },
	  show: function () {
		  this.render();
	  }
	  
});

QuoteBuildController = RouteController.extend({
	  
	  waitOn: function () {
	    return [Meteor.subscribe('serviceitem', this.params._id), Meteor.subscribe('service'), Meteor.subscribe('clients'), Meteor.subscribe('projects')];
	  },
	  data:function() {
		
    	var serviceData = {};
    	var thisID = this.params._id;
 
    	serviceData.quoteItem = Service.findOne(thisID);
    	
    	var step = false;
    	
    	if(this.params.step != undefined)
		{
    		step = true;
    		var thisStep = this.params.step + 'Step';
    		serviceData[thisStep] = true;
		}
    	
    	var whichEstModel = Session.get('estimateModel');

    	serviceData.estvalue = 0;

    	if(whichEstModel === 'instinct')
    	{
    		serviceData.estvalue = serviceData['quoteItem']['instinctEstimate'];
    	}

    	serviceData.step = step;

    	return serviceData;
    
	},
	show: function () {
		this.render();
	},
	before: function () {
		if(!Session.get('estimateModel')) {
			Session.setDefault('estimateModel', 'features');
		}
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


SalesController = RouteController.extend({
	  

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