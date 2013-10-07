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
	  
  }
  
});

   
/*
,
  getSetting: function (key) {
	 var whichSetting = Settings.findOne({'key': key });
	 return whichSetting.value;
  }
  */