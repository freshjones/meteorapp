getSetting = function(whichKey, defaultValue){
  var settings=Settings.find({'key': whichKey }).fetch()[0];
  if(settings){
    return settings.value;
  }
  return typeof defaultValue === 'undefined' ? '' : defaultValue;
}

updateTask = function(feature_id, task)
{
	console.log(feature_id);
	
	var feature = Features.findOne(feature_id);
	var tasks = feature.tasks;
	var index = -1;
	var i;
	for( i = 0; i < tasks.length; i++) {
		if (JSON.stringify(tasks[i]) === JSON.stringify(task) ) {
	        index = i;
	        break;
	    }
	}
	
	 var newTask;
	 
	 switch(task.status)
	 {
	  	case 'todo':
	  		newTask = 'done';
		break;
		
	  	case 'complete':
	  	case 'done':
	  		newTask = 'todo';
		break;
	}

	if (index !== -1) {
		
		if (Meteor.isServer) {
			
		    // update the appropriate rsvp entry with $
			Features.update({_id: feature_id, tasks:task}, { $set : { 'tasks.$.status' : newTask } });
		
		} else {
		    // minimongo doesn't yet support $ in modifier. as a temporary
			  // workaround, make a modifier that uses an index. this is
			  // safe on the client since there's only one thread.
			 var modifier = {$set: {}};
			 modifier.$set["tasks." + index + ".status"] = newTask;
			 Features.update(feature_id, modifier);
		}
	}
}

hasSchedule = function(iteration)
{
	var scheduleData = Schedules.findOne({'iteration_id' : iteration });
	
	if(scheduleData === undefined)
	{
		return false;
	} else {
		return scheduleData;
	}
}