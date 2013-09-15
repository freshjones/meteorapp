Meteor.publish("settings", function () {

	var Future = Meteor.require('fibers/future');
	var future = new Future;

	// simulate high latency publish function
	Meteor.setTimeout(function () {
			future.return(Settings.find());
	}, 1000);

	return future.wait();

});


Meteor.publish("allclients", function () {

	return Clients.find({},{sort:{name:1}});

});

Meteor.publish("allprojects", function () {

	return Projects.find({},{sort:{start:1, client:1, name:1}});

});


