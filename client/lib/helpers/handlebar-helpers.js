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

Handlebars.registerHelper('isSelected', function (value, options) {
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