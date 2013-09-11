Meteor.publish("settings", function () {
  return Settings.find({'key':'duration'}, {fields: {'value':1}});
});