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
	
	 $( ".sortable-items" ).sortable({
		 connectWith: ".sortable-items",
		 handle: ".move",
		 tolerance: "pointer"
	}).disableSelection();
	 
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
					formData.estModel			= 'features';
					
					formData.extra = {};
		    		
					formData.extra.includeEnv = false;
					formData.extra.valueEnv = 5;
		    		
					formData.extra.includeConcept = false;
					formData.extra.valueConcept = 5;
		    		
					formData.extra.includePM = false;
					formData.extra.valuePM = 5;
		    		
					formData.extra.includeConfig = false;
					formData.extra.valueConfig = 5;
		    		
					formData.extra.includeTesting = false;
					formData.extra.valueTesting = 5;
		    		
					formData.extra.includeDeploy = false;
					formData.extra.valueDeploy = 5;
		    		
					formData.extra.includeTraining = false;
					formData.extra.valueTraining = 5;
		    		
					formData.extra.includeUnForeseen = false;
					formData.extra.valueUnForeseen = 5;
		    		
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
	'click .toggleEstModel': function (event) 
	{

		var thisItem = this.quoteItem;
		
  		var whichToggle = $(event.currentTarget).attr('data-action');
  		
  		var whichModel = 'features';
  		
  		switch(whichToggle)
  		{
  			case 'on':
  				$('#toggleEstModel-ON').removeClass('btn-default').addClass('btn-primary');
  				$('#toggleEstModel-OFF').removeClass('btn-primary').addClass('btn-default');
  				
  				whichModel = 'instinct';
  				
  				//$('#estModel').val('instinct');
  				//Session.set('estimateModel', 'instinct');
  			break;

  			case 'off':
  				$('#toggleEstModel-OFF').removeClass('btn-default').addClass('btn-primary');
  				$('#toggleEstModel-ON').removeClass('btn-primary').addClass('btn-default');
  				//$('#estModel').val('features');
  				//Session.set('estimateModel', 'features');
  			break;
  		}
  		
  		Service.update( {_id:thisItem._id }, { $set : { estModel : whichModel   } } );

	},
	'change .quoteExtraToggle': function (event) 
	{
		
		var thisItem = this.quoteItem;
		
		var isChecked = $(event.currentTarget).is(':checked');
		var whichValue = 'extra.' + $(event.currentTarget).attr('id');
		
		eval( 'Service.update( {_id:thisItem._id }, { $set : {  "' + whichValue + '" : isChecked   } } )');
		
	},
	'change .quoteExtraVal': function (event) 
	{
		
		var thisItem = this.quoteItem;
		
		var thisValue = $(event.currentTarget).val();
		var whichValue = 'extra.' + $(event.currentTarget).attr('id');
		
		eval( 'Service.update( {_id:thisItem._id }, { $set : {  "' + whichValue + '" : ' + thisValue + ' } } )');
		
	},
	'click #addFeature': function (event) 
	{
		
		event.preventDefault();
		
		var thisItem 	= this.quoteItem;
		
		var featureID = new Meteor.Collection.ObjectID();
			
		var title 		= $('#ff-featureTitle').val();
		var estimate 	= $('#ff-featureEstimate').val();
		var experience 	= $('#ff-featureExperience').val();
		
		var newFeature 			= {};
		newFeature.feature_id	= featureID.toHexString();
		newFeature.title 		= title;
		newFeature.estimate 	= estimate;
		newFeature.experience 	= experience; 
		
		Service.update({ _id:thisItem._id }, { $addToSet : { 'features' : newFeature } });
		
	},
	'click .removeFeature': function (event) 
	{
		var thisItem 	= this;
		var thisQuoteID = Router.current().params['_id'];
		
		Service.update( { _id:thisQuoteID }, { $pull : { 'features' : { 'feature_id' : thisItem.feature_id } } });
		
	},
	'click .addMajorSet': function (event) 
	{
		
		event.preventDefault();
		
		var thisItem 	= this.quoteItem;
		var setID = new Meteor.Collection.ObjectID();
		
		var title = $('#fsf-title').val();
		
		var newSet = {};
		
		newSet.set_id = setID.toHexString();
		newSet.title = title;
		newSet.sets = [];
		
		if(!thisItem.sets)
		{
			Service.update({ _id:thisItem._id }, { $set : { 'sets' : [] } } );
		}
		
		Service.update({ _id:thisItem._id }, { $addToSet : { 'sets' : newSet } });
		
	},
	'click .addMinorSet': function (event) 
	{
		
		var thisQuoteID = Router.current().params['_id'];
		
		var majorID = $(event.currentTarget).attr('id');
		var minorID = new Meteor.Collection.ObjectID();
		
		var title = $('#fsf-title').val();
		
		var newSet = {};
		newSet.set_id 	= minorID.toHexString();
		newSet.title 	= title;
		newSet.features = [];
		
		//lets add this into a major
		Service.update(
							{ _id:thisQuoteID, 'sets.set_id':'59d44d56e736005337857c8a' }, 
							{ $set : { 'sets.sets' : newSet } }
						);
		

			
	},
	
	
});