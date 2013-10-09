Meteor.methods({
  clearSettings: function () {
	 Settings.remove({});
	 return "Settings Cleared";
  },
  clearPending: function (collection) {
	 eval(collection).remove({"status":"pending"});
	 return "Pending Cleared";
  },
  clearSprints: function () {
	 Sprints.remove({});
	 return "Sprints Cleared";
  },
  featureSort: function (featureList) {
    featureList.forEach(function(doc){
      Features.update( { "_id" : doc._id }, { $set : { "order" : doc.order } } );
    });
    return 'Features updated';
  },
  sprintRebuild: function(sprintData)
  {
	  //first kill the current sprints
	  Sprints.remove({});
	  
	  var sprintNum = 0;
	  //next lets pull in the new sprint data
	  sprintData.forEach(function(doc) {
		  
		  //we need to resort our feature order too for the settings
		  var thisFeatures = doc.features;
		 
		  var featureNum = 0;
		  
		  thisFeatures.forEach(function(feature)
		  {
			  var order = "" + sprintNum + featureNum;
			  Features.update( { "_id" : feature._id }, { $set : { "order" : order } } );
			  featureNum++;
		  });
		  
		  Sprints.insert( doc );
		  
		  sprintNum++;
		  
	  });
	  
	  return 'Sprints Rebuilt';
	  
  },
  scheduleRebuild : function(scheduleData)
  {
	  
	  //console.log(scheduleData);
	  
	  var insertData = {};
	  insertData.iteration_id 		= scheduleData.iteration_id;
	  insertData.hoursinday 		= scheduleData.hoursinday;
	  insertData.userdaytotals 		= scheduleData.userdaytotals;
	  insertData.featureusertotals 	= scheduleData.featureusertotals;
	  
	  //lets flatten the data object to a simple string
	  
	  var user_day_feature_totals = {};
	  
	  _.map(scheduleData.data, function(dayValues, featureKey) { 
		  
		  _.map(dayValues, function(userValues, dayKey) { 
			  
			  _.map(userValues, function(count, userKey) { 
			  
				  thisKey = featureKey + "_" + dayKey + "_" + userKey;
				  
				  user_day_feature_totals[thisKey] = count;
				  
			  });
			  
		  });
		  
	  });
	  
	  insertData.featureuserdaytotals = user_day_feature_totals;
	  
	  var check = Schedules.findOne({'iteration_id' : scheduleData.iteration_id});
	  
	  if(check === undefined)
	  {
		  Schedules.insert(insertData );
	  } else {
		  Schedules.update({ 'iteration_id' : scheduleData.iteration_id }, { $set : insertData } );
	  }
	  
	  return 'done';
	  
	 // var hoursinaday = scheduleData.hoursinday;
	  
	  //ditch the existing schedule
	  //Schedules.remove({iteration_id:scheduleData.iteration_id});
	  
	  //add the new 
	  //
	  
	
	  
  }
  
});

   
/*
,
  getSetting: function (key) {
	 var whichSetting = Settings.findOne({'key': key });
	 return whichSetting.value;
  }
  */