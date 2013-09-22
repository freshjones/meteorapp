// Session variables
Session.set('duration', 2);
Session.set('units', 'weeks');
Session.set('weekends', 'yes');
Session.set('settingsLoaded',false);

// Subscriptions
App = {

	subs : {

		blah : Meteor.subscribe('settings', function(){
			Session.set('settingsLoaded',true);
		}),
		allclients : Meteor.subscribe('allclients'),
		allprojects : Meteor.subscribe('allprojects'),
		singleproject : Meteor.subscribe('singleproject')

	}
};



//Meteor.startup(function() {


  //  Session.set('settings', false); 


//});

/*
 

Meteor.subscribe('default_db_data', function(){
	Session.set('settings', true); 
});

Deps.autorun(function () {});


Deps.autorun(function () {
  Meteor.subscribe('settings');
});

var duration = Settings.find().count();
console.log(duration);
*/
//var units = Settings.find({"key":"units"}, {limit:1}).fetch()[0];
//var myDuration = getDuration(duration.value, units.value);

/*	
var duration = 3;
var i;
var data 		= {};
data.times 		= [];
data.features 	= [];
data.cells 		= [];

for(i=0; i<duration; i++)
{
	data.times[i] = moment().add('d', i).format("MM-DD-YY"); 
	data.cells[i] = 0;
}

var numFeatures = 10;

for(i=0; i<numFeatures; i++)
{
	var thisFeature = {}
	thisFeature.name = "feature - " + i;
	
	data.features[i] = thisFeature; 
	
}
*/