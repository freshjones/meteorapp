var Features = new Meteor.Collection("features"); 

if (Meteor.isClient) {

  Template.backlog.features = function(){
    return Features.find();
  }

  Template.model.events({
	  'click .submit' : function(event)
	  {
		  event.preventDefault();
		 var test = featureJSON();
		 //console.log(test);
		  Features.insert( test );
		  $('#myModal').modal('hide');
	  }
  });
	
}

var featureJSON = function()
{
	var form = $('#modalForm .modal-val');
	var data = getFormData(form);
	return data;
}

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}