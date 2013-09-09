formJSON = function()
{
	var form = $('#modalForm .modal-val');
	var data = getFormData(form);
	return data;
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
		estValue = $.inArray( parseInt(est), array );
	}
	if(estValue == -1 ) { estValue = 0; }
	return estValue;
}




getFormData = function($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
    	
    	var thisVal = n['value'];
    	
    	if( Math.floor(thisVal) == thisVal && $.isNumeric(thisVal)) { thisVal = parseInt(thisVal); }
    	
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

