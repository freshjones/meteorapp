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
	  
	  //next lets pull in the new sprint data
	  sprintData.forEach(function(doc){
		  Sprints.insert( doc );
	  });
	  
	  return 'Sprints Rebuilt';
	  
  }
  
});

   
/*
,
  getSetting: function (key) {
	 var whichSetting = Settings.findOne({'key': key });
	 return whichSetting.value;
  }
  */