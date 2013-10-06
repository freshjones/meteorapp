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

  }
  
});

   
/*
,
  getSetting: function (key) {
	 var whichSetting = Settings.findOne({'key': key });
	 return whichSetting.value;
  }
  */