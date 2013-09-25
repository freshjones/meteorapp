Meteor.publish("settings", function () {

	var Future = Meteor.require('fibers/future');
	var future = new Future;

	// simulate high latency publish function
	Meteor.setTimeout(function () {
			future.return(Settings.find());
	}, 1000);

	return future.wait();

});


//clients
Meteor.publish("clients", function () {
	return Clients.find({},{status:{"pending":0}});
});

Meteor.publish('client', function (client_id) {
  check(client_id, String);
  return Clients.find({_id:client_id});
});


//projects
Meteor.publish("projects", function () {
	return Projects.find({},{ status:{"pending":0}, sort:{start:1, client:1, name:1} });
});

Meteor.publish('project', function (project_id) {
  check(project_id, String);
  return Projects.find({_id:project_id});
});


//features
Meteor.publish("features", function () {
	return Features.find({},{status:{"pending":0}});
});

Meteor.publish('feature', function (feature_id) {
  check(feature_id, String);
  return [
          	Features.find({_id:feature_id}),
          	Activities.find({feature_id:feature_id})
         ];
});
