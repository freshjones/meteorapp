formJSON = function()
{
	var form = $('#modalForm .modal-val');
	var data = getFormData(form);
	return data;
}


formJSONByClass = function(whichClass, whichPrefix)
{
	var form = $(whichClass);
	var data = getFormGroupData(form, whichPrefix);
	
	return data;
}

getFormGroupData = function($form, whichPrefix){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
    	
    	var thisVal = n['value'];
    	
    	if( thisVal && !isNaN(thisVal) ) { thisVal = parseFloat(thisVal); }
    	
    	var thisName = n['name'];
    	
    	if(whichPrefix.length)
    	{
    		thisName = thisName.replace(whichPrefix + "-",""); 
    	}
    	
        indexed_array[thisName] = thisVal;
    });

    return indexed_array;
}


curPath=function(){
	var c=window.location.pathname;
	var b=c.slice(0,-1);
	var a=c.slice(-1);
	if(b==""){return"/"}
	else{ 
		if(a=="/"){
			return b
		}else{
			return c
		}
	}
};

getSliderValue = function( array )
{
	var estValue = 0;
	if( $('#estimate').length )
	{
		var est = $('#estimate').val();
		estValue = $.inArray( parseFloat(est), array );
	}
	if(estValue == -1 ) { estValue = 0; }
	return estValue;
}

function isInteger(value) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    return value % 1 == 0;
}

getFormData = function($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
    	
    	var thisVal = n['value'];
    	
    	if( thisVal && !isNaN(thisVal) ) { thisVal = parseFloat(thisVal); }
    	
        indexed_array[n['name']] = thisVal;
        
    });

    return indexed_array;
    
}

getSubmitData = function()
{
	
	var formData = {};
	
	formData.collection = $('#modalForm input[name="collection"]').val();
	formData.action = $('#modalForm input[name="action"]').val();
	
	if( formData.action == 'update' || formData.action == 'delete')
	{
		formData.id = $('#modalForm input[name="id"]').val();
	}
	
	return formData;
}

