Meteor.publish("settings", function () {

	var Future = Meteor.require('fibers/future');
	var future = new Future;

	// simulate high latency publish function
	Meteor.setTimeout(function () {
			future.return(Settings.find());
	}, 1000);

	return future.wait();

});

//sequentials
Meteor.publish("sequentials", function () {
	return Sequentials.find({});
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

Meteor.publish('inbox', function () {
	return Inbox.find({},{status:{"active":1}});
});

Meteor.publish('inboxitem', function (inbox_id) {
  check(inbox_id, String);
  return Inbox.find({_id:inbox_id});
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

//sprints
Meteor.publish("sprints", function () {
	return Sprints.find({});
});

//schedules
Meteor.publish("schedules", function () {
	return Schedules.find({});
});

Meteor.publish("users", function () {
	return Meteor.users.find({});
});


//sales
Meteor.publish("sales", function () {
	return Sales.find({},{status:{"archive":0}});
});

Meteor.publish('salesitem', function (sales_id) {
  check(sales_id, String);
  return Sales.find({_id:sales_id});
});



//service
Meteor.publish("service", function () {
	return Service.find({},{status:{"archive":0}});
});

Meteor.publish('serviceitem', function (service_id) {
  check(service_id, String);
  return Service.find({_id:service_id});
});


Meteor.publish("quotetemplates", function () {
	return QuoteTemplates.find({status:"active"});
});

Meteor.publish("quotes", function () {
	return Quotes.find({},{status:{"archive":0}});
});

Meteor.publish('quote', function (quote_id) {
	  check(quote_id, String);
	  return Quotes.find({_id:quote_id});
});
