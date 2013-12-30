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

Handlebars.registerHelper('checkEnd', function(value, options) {

	var classVal = '';

	if(options.fn(this) == value )
	{
		classVal = 'day-end';
	}

	return classVal;

});

Handlebars.registerHelper('optionSelected', function(value) {

	var code ="";

	if( value == this.code  ) { 
		code = ' selected="selected" ';
	}
	return code;

});

Handlebars.registerHelper('isSelected', function(value) {

	

});

Handlebars.registerHelper('checkuserhours', function(context, options) {

	context.label = 'success';
	
	if( parseFloat(context.count ) > parseFloat(context.hoursperresource) )
	{
		context.label = 'danger';
		
	} else if ( parseFloat(context.billablecount) < parseFloat(context.hoursperresource)-10 )
	{
		context.label = 'danger';
		
	} else if ( parseFloat(context.billablecount) < parseFloat(context.hoursperresource)-5 )
	{
		context.label = 'warning';
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
	
	var thisPath = curPath();
	
	if(path == '/')
	{
		
		return thisPath == path ? 'active' : '';
		
	} else {
		
		if(thisPath.indexOf(path) >= 0) 
		{
			return 'active';
		} else {
			return '';
		}
		
	}
	
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

Handlebars.registerHelper('getUserDayTotals', function(context, options) {
   
	var returnVal = 0;
	
	var scheduleData = Schedules.findOne({ _id:'DwZGcNSADzvHL9SPZ' });
	
	if(scheduleData.hoursinday > 0 )
	{
		returnVal = scheduleData.hoursinday;
	}
	
    return returnVal;
    
});

Handlebars.registerHelper('setCellValueClass', function(context) {
	
	var returnVal = 'schedule-default';
	
	var hoursperday = Session.get('hoursperday');
	
	if(context > 0)
	{
		returnVal = 'schedule-good';
		
		if(context > hoursperday)
		{
			returnVal = 'schedule-danger';
		}
		
	}
	
    return returnVal;
    
});


Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('addlinebreaks', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    text = text.replace(/(<br>)/gm, "\n");
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('fmtTimestamp', function (value, options) {
	
	var date = new Date(value*1000);
	
	return date.toString("ddd, MMM d, yyyy");
	
});

/*
Handlebars.registerHelper('getProjectName', function(value) {
	var projectData = Projects.findOne({'_id':value});
	return projectData.name;
});
*/

Handlebars.registerHelper('getTemplate', function(name, data) {
	return Template[name](data);
});

Handlebars.registerHelper('whichFormClass', function(value, btn) {
	
    var btnClass = 'btn-default';
    
    if(value===btn)
    {
    	btnClass =  'btn-success';
    }
    
	return btnClass;
});

Handlebars.registerHelper('actionClass', function(value) {
    if(value == false)
    {
    	return 'hidden';
    } else {
    	return value;
    }
});

Handlebars.registerHelper('counter', function(value, collection) {
	var count = '';
	switch(value)
	{
		case 'active':
			var inboxCount = eval(collection).find({status:'active'}).count();
			if(inboxCount > 0 )
			{
				count = inboxCount;
			}
		break;
		
		case 'verify':
			var salesLeads = eval(collection).find({status:'verify'}).count();
			if(salesLeads > 0 )
			{
				count = salesLeads;
			}
			
		break;
	}

	return count;

});

Handlebars.registerHelper('activeSalesInbox', function(value) {
   
	var returnClass = '';
	var thisInbox = Router.current().params['inbox'];
	
	if(value === thisInbox)
	{
		returnClass = 'active';
	}
	
	return returnClass;
	
});


Handlebars.registerHelper('activeServiceInbox', function(value) {
	   
	var returnClass = '';
	var thisInbox = Router.current().params['inbox'];
	
	if(value === thisInbox)
	{
		returnClass = 'active';
	}
	
	return returnClass;
	
});

