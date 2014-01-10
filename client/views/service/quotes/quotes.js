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
		 tolerance: "pointer",
		 placeholder: "placeholder",
		 stop: function( event, ui ) 
		 {
			 rebuildFeatures();
		 }
	}).disableSelection();
	 
}


function buildFeatureChildren(parentID, featureData)
{

	var featureArray = [];
	
	featureData.each(function(counter)
	{
		
		var thisID = $(this).attr('id');

		var featureItem = {};
		
		featureItem.feature_id 	= thisID;
		featureItem.parent 		= parentID;
		featureItem.order 		= counter;
		featureItem.type		= $(this).children('.feature-data').find('.type').text();
		featureItem.title		= $(this).children('.feature-data').find('.title').text();
		
		var experience = $(this).children('.feature-data').find('.experience').text();
		var estimate = $(this).children('.feature-data').find('.estimate').text();
		
		if( experience && !isNaN(experience) ) { experience = parseFloat(experience); } else { experience = 0; }
		if( estimate && !isNaN(estimate) ) { estimate = parseFloat(estimate); } else { estimate = 0; }
		
		featureItem.experience	= experience;
		featureItem.estimate	= estimate;

		var numChildren = $(this).children('.sortable-items').children('.feature-item').length;

		if(numChildren)
		{
			featureItem.children 	= buildFeatureChildren( thisID, $(this).children('.sortable-items').children('.feature-item') );
			
			featureItem.childAggregates = {};
			
			featureItem.childAggregates.estimate =  buildFeatureChildAgg( $(this).children('.sortable-items').children('.feature-item'), 'estimate', 0 );
			featureItem.childAggregates.experience =  buildFeatureChildAgg( $(this).children('.sortable-items').children('.feature-item'), 'experience', 0 );
			
		}

		featureArray.push(featureItem);

	});

	return featureArray;

}

function buildFeatureChildAgg( data, type, sum )
{
	
	data.each(function(index)
	{
		
		var thisValue = 0;
			
		var thisType = $(this).children('.feature-data').find('.type').text();
		
		if(type == 'estimate')
		{
			var estimate = $(this).children('.feature-data').find('.estimate').text();
			if( estimate && !isNaN(estimate) ) { estimate = parseFloat(estimate); } else { estimate = 0; }
			
			thisValue = estimate;
		}
		
		if(type == 'experience')
		{
			var experience = $(this).children('.feature-data').find('.experience').text();
			if( experience && !isNaN(experience) ) { experience = parseFloat(experience); } else { experience = 0; }
			
			thisValue = experience;
		}
		
		if(thisType === 'feature')
		{
			sum += parseFloat(thisValue);
		}
		
		var numChildren = $(this).children('.sortable-items').children('.feature-item').length;

		if(numChildren)
		{	
			sum = buildFeatureChildAgg( $(this).children('.sortable-items').children('.feature-item'), type, sum);
			
		}
		
	});
	
	return sum;
	
}

function rebuildFeatures()
{
	var thisQuoteID = Router.current().params['_id'];
	var featureArray = rebuildFeatureData();
	
	Service.update({ _id:thisQuoteID }, { $set : { 'features' : featureArray } } );
	
}

function rebuildFeatureData()
{
	
	var thisQuoteID = Router.current().params['_id'];
	
	var featureArray = [];
	
	$('#featureTop > .feature-item').each(function(counter)
	{

		var thisID = $(this).attr('id');

		var parentID = 'top';
		
		var featureItem = {};

		featureItem.feature_id 	= thisID;
		featureItem.parent 		= parentID;
		featureItem.order 		= counter;
		featureItem.type		= $(this).children('.feature-data').find('.type').text();
		featureItem.title		= $(this).children('.feature-data').find('.title').text();

		var experience = $(this).children('.feature-data').find('.experience').text();
		var estimate = $(this).children('.feature-data').find('.estimate').text();
		
		if( experience && !isNaN(experience) ) { experience = parseFloat(experience); } else { experience = 0; }
		if( estimate && !isNaN(estimate) ) { estimate = parseFloat(estimate); } else { estimate = 0; }
		
		featureItem.experience	= experience;
		featureItem.estimate	= estimate;

		var numChildren = $(this).children('.sortable-items').children('.feature-item').length;

		if(numChildren > 0 )
		{
			featureItem.children = buildFeatureChildren( thisID, $(this).children('.sortable-items').children('.feature-item') );
			featureItem.childAggregates = {};
			
			featureItem.childAggregates.estimate =  buildFeatureChildAgg( $(this).children('.sortable-items').children('.feature-item'), 'estimate', 0 );
			featureItem.childAggregates.experience =  buildFeatureChildAgg( $(this).children('.sortable-items').children('.feature-item'), 'experience', 0 );
			
		}

		featureArray.push(featureItem);

	});

	return featureArray;
	
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
		
  		event.preventDefault();
  		
  		var thisItem = this.quoteItem;

  		var serviceID = thisItem._id;
  		
  		delete thisItem._id;

  		thisItem.service_id 	= serviceID;
  		thisItem.status 		= 'review';
  		thisItem.type 			= 'service';
  		thisItem.quotenum 		= getSequentialNumber('quote');

  		Quotes.insert(thisItem);
  		
  		Service.update({_id : serviceID }, { $set : { 'status' : 'archive' } } );
  		
  		Router.go('service', {inbox:'quote'});
  		
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
	'click .addFeature': function (event) 
	{
		
		event.preventDefault();
		
		var thisItem 	= this.quoteItem;
		
		var featureID = new Meteor.Collection.ObjectID();
			
		var title 		= $('#ff-featureTitle').val();
		var estimate 	= $('#ff-featureEstimate').val();
		var experience 	= $('#ff-featureExperience').val();
		var type 		= $(event.currentTarget).attr('data-type');
		
		switch(type)
		{
			case 'major':
			case 'minor':
				estimate = 0;
				experience = 0;
			break;
		}
		
		var newFeature 			= {};
		newFeature.feature_id	= featureID.toHexString();
		newFeature.title 		= title;
		newFeature.estimate 	= estimate;
		newFeature.experience 	= experience;
		newFeature.type 		= type;
		
		Service.update({ _id:thisItem._id }, { $addToSet : { 'features' : newFeature } });
		
	},
	'click .removeFeature': function (event) 
	{
		var thisItem 	= this;
		var thisQuoteID = Router.current().params['_id'];
		
		Service.update( { _id:thisQuoteID }, { $pull : { 'features' : { 'feature_id' : thisItem.feature_id } } });
		
	},
	'click #fsf-submit': function (event) 
	{
		
		event.preventDefault();
		
		var thisItem 	= this.quoteItem;
		var setID = new Meteor.Collection.ObjectID();
		
		var parent = $('#fsf-level').val();
		var title = $('#fsf-title').val();
		
		var newSet = {};
		
		newSet.set_id = setID.toHexString();
		newSet.parent = parent;
		newSet.title = title;
		newSet.features = [];
		
		if(!thisItem.sets)
		{
			Service.update({ _id:thisItem._id }, { $set : { 'sets' : [] } } );
		}
		
		Service.update({ _id:thisItem._id }, { $addToSet : { 'sets' : newSet } });
		
	},
	'click .feature-save, click .fts-cancel': function (event) 
	{
		event.preventDefault();
		$('#saveFeatureTemplate').fadeToggle();
	},
	'click #fts-submit': function (event) 
	{
		event.preventDefault();
		
		var quoteTitle = $('#fts-name').val();
		var quoteData = rebuildFeatureData();
		
		var templateObj = {};
		
		templateObj.title = quoteTitle;
		templateObj.status = 'active';
		templateObj.data = quoteData;
		
		QuoteTemplates.insert(templateObj);
		
	},
	'click .feature-load, click .ftl-cancel': function (event) 
	{
		event.preventDefault();
		$('#loadFeatureTemplates').fadeToggle();
	},
	'click #ftl-submit': function (event) 
	{
		event.preventDefault();
		
		var thisQuoteID = Router.current().params['_id'];
		var templateOption = $('#loadTemplateOption').val();
		var quoteData = QuoteTemplates.findOne(templateOption);
		
		Service.update({ _id:thisQuoteID }, { $set : { 'features' : quoteData.data } } );
		
	},
	
	
	
});