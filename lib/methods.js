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
  }
  
});

   
/*
,
  getSetting: function (key) {
	 var whichSetting = Settings.findOne({'key': key });
	 return whichSetting.value;
  }
  */