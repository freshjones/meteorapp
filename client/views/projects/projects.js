//set modal to off initially
Session.setDefault('showModal', null);

//Currently selected project
Session.setDefault('project_id', null);

//When editing project, ID of the project
Session.setDefault('editing_project', null);



Template.projects.events({

	'click #newProject': function (event) {
		event.preventDefault();
		var newProject = Projects.insert({status:"pending"});
		Session.set('project_id', newProject);
		//Deps.flush();
		Session.set('showModal', true);
  	},
	'click .edit': function (event) {
		event.preventDefault();
		Session.set('project_id', this._id);
		//Deps.flush();
		Session.set('showModal', true);
	  
  	}, 'click .close, click .modal-backdrop, click .close-modal ': function (event) {
		  event.preventDefault();
		  Session.set('project_id', null);
		 // Deps.flush();
		  Session.set('showModal', false);
	}, 'click #addMilestone': function (event) {
		
		event.preventDefault();
		var thisName = $('input[name="milestone-name"]').val();
		var thisDate = $('input[name="milestone-date"]').val();
		Projects.update(this._id, {$addToSet: { milestones: { name:thisName, date:thisDate } } } );
		
		//Deps.flush();	
		$('.dateFinder').datepicker('remove');
		
		$('input[name="milestone-name"]').val('');
		$('input[name="milestone-date"]').val('');
		
		
  	}, 'click button.submit ': function (event) {
  		
  		console.log(this._id);
  		event.preventDefault();
  		var data = formJSON();
		data.status = 'active';
  		
  		
	}, 'click .pull-remove ': function (event) {
  		event.preventDefault();
  		
  		//Projects.update(this._id, {$addToSet: { milestones: [{name:value}] }});
  		
	}
	
  	
});

Template.project.project = function () {
	  var project_id = Session.get('project_id');
	  return  Projects.findOne({_id:project_id});
};

Template.project.clientselect = function () {
	  var clientSelect = Clients.find();
	  return clientSelect;
};

Template.projects.rendered = function() {
	$('.dateFinder').datepicker({ 
		format: 'mm-dd-yyyy', 
		autoclose: true
	});
}

