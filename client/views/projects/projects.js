Template.projects.events = crudEvents('Projects');
  

	

Template.projects.rendered = function() {

	modalEvents();
	
}

Template.milestones.milestones = function(){
	var data = Projects.findOne({"_id" : this.id });
	if(data != undefined)
	return data.milestones;
}

