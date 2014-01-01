Template.quotebuild.rendered = function() {
	
	$('.btn-tooltip').tooltip({placement:'top', delay: { show: 900} }); //initialize all tooltips in this template

	$('#buildquoteform').parsley({
	    errors: {
	        classHandler: function ( element, isRadioOrCheckbox ) {
	            return $( element ).closest('.form-group');
	        },
	        container: function (element, isRadioOrCheckbox) {
	            var $container = element.closest('.form-group');
	            if ($container.length === 0) {
	                $container = $("<div></div>").insertAfter(element);
	            }
	            return $container;
	        }
	    },
	    successClass: 'has-success', 
	    errorClass: 'has-error'
	});
	
	$('.make-switch').bootstrapSwitch();
	
	 $('#chooseEst').on('switch-change', function (event, data) {
		 
		var whichVal = 'features';
		 
		if(data.value === true)
		{
			 whichVal = 'instinct';
		}
		
		Meteor.call('toggleScraper', whichVal);
		
	});
	
}

Template.quotebuild.events({

	'click .back': function (event) 
	{
  		event.preventDefault();
  		Router.go('service', {inbox:'quote'});
  	},
  	'click .archive': function (event) 
	{
  		event.preventDefault();
  		var thisItem = this.quoteItem;
  		Service.update( {_id:thisItem._id }, { $set : { status : "archive" } } );
  		
  		Router.go('service', {inbox:'quote'});
  		
  	},
  	'click .step': function (event) 
	{
  		event.preventDefault();
  		
  		var thisItem = this.quoteItem;
  		var curParams = Router.current().params;
  		var next = $(event.currentTarget).attr('data-action');
  		
  		curParams.step = undefined;
  		
  		if(next != undefined && next != 'overview')
  		{
  			curParams.step = next;
  		}
  		
  		Router.go('quotebuild', curParams);
  		
  	},
  	'click .stepsave': function (event) 
	{
  		event.preventDefault();
  		
  		var thisItem = this.quoteItem;
  		var curParams = Router.current().params;
  		var next = $(event.currentTarget).attr('data-action');
  		
  		//isValid = $('#buildquoteform').parsley('validate');
  		//console.log(isValid);
		//if(isValid)
  		//{

			var formData = {};
			
			//which form?
			var whichStep = $('#ff-step').val();
			
			switch(whichStep)
			{
				case 'overview':
					formData.title 				= $('#ff-title').val();
					formData.description 		= $('#ff-description').val();
					formData.purpose 			= $('#ff-purpose').val();
					formData.weight 			= $('input[name="weight"]:checked').val();
					formData.size 				= $('input[name="size"]:checked').val();
					formData.instinctEstimate	= $('#ff-instinct').val();
				break;
				
				case 'scope':
					formData.scope = {};
					formData.scope.included		= $('#ff-included').val();
					formData.scope.notincluded	= $('#ff-notincluded').val();
				break;
			
				case 'assumptions':
					formData.assumptions		= $('#ff-assumptions').val();
				break;
				
				case 'features':
					
				break;
				
			}
			
			Service.update( {_id:thisItem._id }, { $set : formData } );
	  		
			curParams.step = undefined;
	  		
			if(next != undefined && next != 'overview')
	  		{
	  			curParams.step = next;
	  		}
		
			Router.go('quotebuild', curParams);
			
  		//}
  		
  	},
  	'click #ff-savequote': function (event) 
	{
  		
  		var useInstinctEst = $('input[name="useInstictEstimate"]').is(':checked');
  		
	},
	
	
});