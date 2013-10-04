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
		Router.go('project', { _id : this._id });
		//Router.path('project' );
		//Session.set('project_id', this._id);
		//Deps.flush();
		//Session.set('showModal', true);
	  
  	},
	'click .remove': function (event) {
		event.preventDefault();
		Projects.remove({_id:this._id});
		//Session.set('project_id', this._id);
		//Deps.flush();
		//Session.set('showModal', true);
  	}, 
  	'click .close, click .modal-backdrop, click .close-modal ': function (event) {
		  event.preventDefault();
		  Session.set('project_id', null);
		 // Deps.flush();

		//ditch the record if not needed
		if(this.status === 'pending')
		{
		 	Projects.remove({_id:this._id});
		}

		Session.set('showModal', false);

	}, 
	'click #addMilestone': function (event) {
		
		event.preventDefault();
		var thisName = $('input[name="milestone-name"]').val();
		var thisDate = $('input[name="milestone-date"]').val();
		Projects.update(this._id, {$push: { milestones: { name:thisName, date:thisDate } } } );
		
		//Deps.flush();	
		$('.dateFinder').datepicker('remove');
		
		$('input[name="milestone-name"]').val('');
		$('input[name="milestone-date"]').val('');	
		
  	}, 
  	'click button.submit ': function (event) {
  		
  		console.log(this._id);
  		event.preventDefault();
  		var data = formJSON();
		data.status = 'active';
  		Projects.update( {_id:this._id }, { $set : data } );

  		//close the modal
  		Session.set('showModal', false);

	}, 
	'click .remove-milestone ': function (event) {
  		event.preventDefault();

  		var milestone = this.milestone;
    	var id = this.project_id;

		Projects.update({_id: id}, {$pull: {milestones:milestone}});

	}
	
  	
});


/*
Template.project.project = function () {
	  return  Projects.findOne({_id:project_id});
};


Template.project.clientselect = function () {
	  var clientSelect = Clients.find();
	  return clientSelect;
};
*/

Template.projects.rendered = function() {

	$('.dateFinder').datepicker({ 
		format: 'mm-dd-yyyy', 
		autoclose: true
	});
}

/*
Template.project.milestone_items = function () {
  var project_id = this._id;
  return _.map(this.milestones || [], function (milestone) {
    return {project_id: project_id, milestone: milestone};
  });
};
*/