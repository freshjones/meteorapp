Handlebars.registerHelper('select', function(value, options) {
	// Create a select element 
    var select = document.createElement('select');
    // Populate it with the option HTML
    select.innerHTML = options.fn(this);
    // Set the value
    select.value = value;
    // Find the selected node, if it exists, add the selected attribute to it
    if (select.children[select.selectedIndex])
        select.children[select.selectedIndex].setAttribute('selected', 'selected');
    return select.innerHTML;
});


Handlebars.registerHelper('toHexString', function(value) {

	return value.toHexString();

});

Handlebars.registerHelper('optionSelected', function(value) {

	var code ="";

	if( value == this.code  ) { 
		code = ' selected="selected" ';
	}
	return code;

});

Handlebars.registerHelper('checkuserhours', function(context, options) {

	context.badge = 'success';
	
	if( parseFloat(context.count ) > parseFloat(context.hoursperresource) )
	{
		context.badge = 'important';
		
	} else if ( parseFloat(context.billablecount) < parseFloat(context.hoursperresource)-10 )
	{
		context.badge = 'important';
		
	} else if ( parseFloat(context.billablecount) < parseFloat(context.hoursperresource)-5 )
	{
		context.badge = 'warning';
	}
	
	//lets round the count as well
	context.count = Math.round(context.count * 10) / 10;
	context.billablecount = Math.round(context.billablecount * 10) / 10;
	
	return options.fn(context);
	
});

Handlebars.registerHelper('projectOptions', function(value) {
	
	var name ="";

	if( value == this.name  ) { 
		name = ' selected="selected" ';
	}
	return name;

});

Handlebars.registerHelper('isChecked', function (value, options) {
	var container = $('<div></div>');
	var wrapped = container.html(options.fn(this));
	if( value == $(options.fn(this)).val()  ) { 
		wrapped.find('input').attr('checked', 'checked');
	}
	return $(wrapped).html();
});



Handlebars.registerHelper('active', function(path) {
    return curPath() == path ? 'active' : '';
});

Handlebars.registerHelper('arrayify',function(obj){
    result = [];
    for (var key in obj) result.push({key:key,value:obj[key]});
    return result;
});

Handlebars.registerHelper('getSession', function(value) {
    return Session.get(value);
});

Handlebars.registerHelper('whichIteration', function(value) {
    var curSprint = Session.get('currentSprint');
    var thisSprint = 0;
    
    var container = $('<div></div>');
    var wrapped = container.html('');
    var bob = '';

    if(curSprint === null)
    {
    	Session.set('currentSprint', 0);

		wrapped = container.html('Iteration:' + thisSprint);

    }

    return $(wrapped).html();
});

/*
Handlebars.registerHelper('getProjectName', function(value) {
	var projectData = Projects.findOne({'_id':value});
	return projectData.name;
});
*/

