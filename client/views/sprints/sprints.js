//Currently selected project
Session.setDefault('feature_id', null);

//When editing project, ID of the project
Session.setDefault('editing_feature', null);

//When editing project, ID of the project
Session.set('currentSprint', null);

Template.sprints.events({

	'click #newFeature': function (event) {
		event.preventDefault();
		var newFeature = Features.insert({status:"pending", estimate:0, order:9999 });
		
		Session.set('feature_id', newFeature);
		//Deps.flush();
		Session.set('showModal', true);
  	},
	'click .edit': function (event) {
		event.preventDefault();
		Session.set('feature_id', this._id);
		Session.set('showModal', true);	  
  	},
	'click .remove': function (event) {
		event.preventDefault();
		Features.remove({_id:this._id});
		//Session.set('project_id', this._id);
		//Deps.flush();
		//Session.set('showModal', true);
  	}, 
  	'click .close, click .modal-backdrop, click .close-modal ': function (event) {
		  event.preventDefault();
		  Session.set('Features', null);
		 // Deps.flush();

		//ditch the record if not needed
		if(this.status === 'pending')
		{
			Features.remove({_id:this._id});
		}

		Session.set('showModal', false);

	}, 
  	'click button.submit ': function (event) {
  		
  		event.preventDefault();
  		var data = formJSON();
		data.status = 'active';
		Features.update( {_id:this._id }, { $set : data } );

  		//close the modal
  		Session.set('showModal', false);

	}, 
	'click #addTask': function (event) {
		
		event.preventDefault();
		var thisName = $('input[name="task"]').val();
		Features.update(this._id, {$push: { tasks: { name:thisName, status:"todo" } } } );
		$('input[name="task"]').val('');
  	}, 
	'click .remove-task ': function (event) {
  		event.preventDefault();

  		var task = this.task;
    	var id = this.feature_id;

    	Features.update({_id: id}, {$pull: {tasks:task}});

	},
	'click .complete-task ': function (event) {
  		
		event.preventDefault();
		var id = this.feature_id;
		var task = this.task;
		
		updateTask(id, task);
    	
	},
	
	'click #addActivity': function (event) {
		
		event.preventDefault();
		var thisActivity = $('#activity').val();
		
		Activities.insert({'feature_id':this._id, 'description': thisActivity });
		
		$('#activity').val('');

  	},
  	

});


Template.sprint.feature = function () {

	var feature_id = Session.get('feature_id');
	var featureHandle =  Meteor.subscribe('feature', feature_id );

	if( featureHandle.ready() )
	{

	  var featureData = {};
	  featureData = Features.findOne({_id:feature_id});
	  featureData.activities = Activities.find({'feature_id':feature_id}).fetch();

	  return featureData;

	}

};

Template.sprint.projectselect = function () {
	  var projectSelect = Projects.find({ status:{ $ne: 'pending'} });
	  return projectSelect;
};


Template.sprint.task_items = function () {
  var feature_id = this._id;
  return _.map(this.tasks || [], function (task) {
    return {feature_id: feature_id, task: task};
  });
};


Template.sprints.rendered = function() {
	
	var estimate_array = [0, .1, .3, .5, 1, 3, 5, 10, 30, 50];

	function estimateSliding(event,ui)
	{
	    //update the amount by fetching the value in the value_array at index ui.value
	    $('#estimate-label').html( estimate_array[ui.value] ); 
	    $('#estimate').val( estimate_array[ui.value] ); 
	}

	$('#slider').slider
		(
			{ 
				min:0, 
				max:estimate_array.length - 1, 
				slide: estimateSliding,
				value: getSliderValue( estimate_array )
			}
		);
	
	$("#sortable tbody").sortable({
		
	    handle: "td.move",
	    update: function( event, ui ) {
	    	$('.sortable-items .sortable-item').each(function(index){
	    		Features.update( { "_id" : $(this).attr('id') }, { $set : { "order" : index } } );
	    	});
	    }
	}).disableSelection();

}

/*
Template.sprints.myfeatures = function(){
	  
	return Features.find({}, {sort: {order: 1}});

};

Template.sprints.events = crudEvents('Features');
  
Template.sprints.rendered = function() {
	
	$("#sortable tbody").sortable({
		
	    handle: "td.move",
	    update: function( event, ui ) {
	    	$('.sortable-items .sortable-item').each(function(index){
	    		Features.update( { "_id" : $(this).attr('id') }, { $set : { "order" : index } } );
	    	});
	    }
	}).disableSelection();
		
}
*/