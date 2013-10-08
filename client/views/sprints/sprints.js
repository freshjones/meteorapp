//Currently selected project
Session.setDefault('feature_id', null);

//When editing project, ID of the project
Session.setDefault('editing_feature', null);

//When editing project, ID of the project
Session.set('currentSprint', null);

/*
Deps.autorun(function (c) {
  
  if (Session.equals("updateSprint", true))
  {
  	getBob();
  	Session.set('updateSprint', false);
  }
    
});
*/

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
	
	$(".sortable-items").sortable({
		
	    handle: ".move",
	    connectWith: ".sortable-items",
	    stop: function( event, ui ) {
	    	rebuildSprints(false);
	    }

	}).disableSelection();

}

hoursPreResource = function() {
	
	var hoursinday = getSetting('hoursperday', 6);
	var numresources = 2;
	
	/* duration = num days in the sprint */
	var duration = getDuration();

	var hours_per_resource = hoursinday * duration;
	
	return hours_per_resource;
}


rebuildSprints = function(useDB)
{

	var hoursinday = getSetting('hoursperday', 6);;
	var numresources = 2;
	
	/* duration = num days in the sprint */
	var duration = getDuration();

	var hours_per_resource = hoursPreResource();
	
	/* potentialhours are the amount of hours available for the team to use */
	var potentialhours = ( duration * hoursinday) * numresources;
	
	/* total estimate for all features */
	var estimatedHours = 0;
	
	var sortableItems = $('.sortable-item');
	
	if(useDB && useDB === true)
	{
		sortableItems = Features.find({'status':{ $ne: 'pending'} }, {sort:{order:1}}).fetch();
	
		sortableItems.forEach(function (doc) { estimatedHours += parseFloat(doc.estimate); }); 
		
	} else {
		
		sortableItems.each(function(index){
			estimatedHours += parseFloat( $(this).find('.estimate').text() );
		});
		
	}
	
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
	
	//we have resorted our features we can now create an array for rebuilding the sprints
	//based on how we've reordered things
	//create a variable to hold the data
	
	/*
	 * @todo - make this DRY
	 */
	
	if(useDB && useDB === true)
	{
		
		sortableItems.forEach(function(doc){
			
			var thisFeatureID = doc._id;
			var thisEstimate = parseFloat(doc.estimate);
			var thisBillable = doc.billable;
			
			hourCount += thisEstimate;
			
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
			
			var hourEstimated = Math.round(hourCount * 10 ) / 10;
			var hourWasted = Math.round((potentialhours - hourCount) * 10 ) / 10;
			var percentUtilization = Math.round( ( (hourEstimated / potentialhours) * 100) * 10 ) / 10;
			
			iterations[whichIteration]['iteration']['hoursUsed'] 			= hourEstimated;
			iterations[whichIteration]['iteration']['hoursNotUsed'] 		= hourWasted;
			iterations[whichIteration]['iteration']['percentUtilized'] 		= percentUtilization;
			
			if('features' in iterations[whichIteration] == false){
				iterations[whichIteration]['features'] = []; 
			}

			iterations[whichIteration]['features'].push({ '_id' : thisFeatureID });

			//feature iterator
			i++;
		
		});
		
	} else {
		
		sortableItems.each(function(index){
			
			var thisFeatureID = $(this).attr('id');
			var thisEstimate = parseFloat( $(this).find('.estimate').text() );
			var thisBillable = $(this).find('.billable').text();
			
			hourCount += thisEstimate;
			
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
			
			var hourEstimated = Math.round(hourCount * 10 ) / 10;
			var hourWasted = Math.round((potentialhours - hourCount) * 10 ) / 10;
			var percentUtilization = Math.round( ( (hourEstimated / potentialhours) * 100) * 10 ) / 10;
			
			iterations[whichIteration]['iteration']['hoursUsed'] 			= hourEstimated;
			iterations[whichIteration]['iteration']['hoursNotUsed'] 		= hourWasted;
			iterations[whichIteration]['iteration']['percentUtilized'] 		= percentUtilization;
			
			if('features' in iterations[whichIteration] == false){
				iterations[whichIteration]['features'] = []; 
			}

			iterations[whichIteration]['features'].push({ '_id' : thisFeatureID });

			//feature iterator
			i++;
		
		});
		
	}
	
	//once we have our iteration script we can reenter into the DB
	Meteor.call("sprintRebuild", iterations, function(error,result){
	    if(error){
	        console.log(error.reason);
	    }
	    else{
	    	console.log(result);
	    }
	});
	
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