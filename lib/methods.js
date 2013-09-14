Meteor.methods({
  clearSettings: function () {
	 Settings.remove({});
	 return "Settings Cleared";
  }
  
});

/*
,
  getSetting: function (key) {
	 var whichSetting = Settings.findOne({'key': key });
	 return whichSetting.value;
  }
  */