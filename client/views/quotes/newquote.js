Template.newquote.rendered = function() {
	
	$('.btn-tooltip').tooltip({placement:'top', delay: { show: 900} }); //initialize all tooltips in this template

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
	 
	$('.showEstValues').popover({ trigger:'hover', html:true, placement:'top'});

	
}

Template.newquote.events({

	'click .back': function (event) 
	{
  		event.preventDefault();
  		
  		Router.go('quotes');
  		
  	},
  	'click .step': function (event) 
	{
  		event.preventDefault();
  		
  		var thisStep = $(event.currentTarget).attr('data-action');
  		
  		Router.go('newquote', {_id:this.quote._id}, {query: { 'view' : thisStep } });
  		
  	},
  	'click .stepsave': function (event) 
	{
  		event.preventDefault();
  		
  		var thisItem = this.quote;
  		var curParams = Router.current().params;
  		var next = $(event.currentTarget).attr('data-action');
  		
  		var formData = {};

		var whichStep = $('#ff-step').val();
			
		switch(whichStep)
		{
			case 'overview':
				
				var accountdetails = {};
				
				var accountType = $('input:radio[name=clientType]:checked').val();
				
				switch(accountType)
				{
				
					case 'existing':
						
						accountdetails.accountType 	= 'existing';
						
						accountdetails.account		= $('#ff-client').val();
						accountdetails.customer		= $('#ff-customer').val();
						
					break;
					
					case 'new':
						
						accountdetails.accountType 		= 'new';
						
						accountdetails.code				= $('#account_code').val();
						accountdetails.name				= $('#account_name').val();
						accountdetails.fname			= $('#contact_fname').val();
						accountdetails.lname			= $('#contact_lname').val();
						accountdetails.email			= $('#contact_email').val();
						
					break;
				
				}
				
				formData.accountdetails		= accountdetails;
				
				formData.assigned			= $('input:radio[name=ff-accountrep]:checked').val();
				
				formData.title 				= $('#ff-title').val();
				formData.description 		= $('#ff-description').val();
				formData.purpose 			= $('#ff-purpose').val();
				formData.weight 			= $('input[name="weight"]:checked').val();
				formData.size 				= $('input[name="size"]:checked').val();
				formData.instinctEstimate	= $('#ff-instinct').val();
				formData.estModel			= 'features';
				
				if(this.quote.extra == undefined)
				{
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
				}
	    		
			break;
			
			case 'scope':
				formData.scope = {};
				formData.scope.included		= $('#ff-included').val();
				formData.scope.notincluded	= $('#ff-notincluded').val();
				formData.assumptions		= $('#ff-assumptions').val();
			break;
			
			case 'features':
				
			break;
			
		}
		
		Quotes.update( {_id:this.quote._id }, { $set : formData } );
  		
		nextStep = undefined;
  		
		if(next != undefined && next != 'overview')
  		{
			nextStep = next;
  		}
	
		Router.go('newquote', {_id:this.quote._id}, {query: { 'view' : nextStep } });
  		
  	},
  	'click .addFeature': function (event) 
	{
		
		event.preventDefault();
		
		var thisItem 	= this.quote;
		
		var featureID = new Meteor.Collection.ObjectID();
		
		var strategy 	= $('#ff-featureEstimateStrategy').val();
		var design 		= $('#ff-featureEstimateDesign').val();
		var build 		= $('#ff-featureEstimateBuild').val();
		
		var estimate 	= parseFloat(strategy) + parseFloat(design) + parseFloat(build);
		
		var title 		= $('#ff-featureTitle').val();
		
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
		
		var newFeature 						= {};
		newFeature.feature_id				= featureID.toHexString();
		newFeature.title 					= title;
		newFeature.estimateData				= {};
		newFeature.estimateData.strategy 	= strategy;
		newFeature.estimateData.design 		= design;
		newFeature.estimateData.build 		= build;
		
		newFeature.estimate 				= estimate;
		newFeature.experience 				= experience;
		newFeature.type 					= type;
		
		Quotes.update({ _id:thisItem._id }, { $addToSet : { 'features' : newFeature } });
		
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
		
		var addto = false;
		
		if( $('#addto').is(':checked') )
		{
			addto = true;
		}
		
		var thisQuoteID = Router.current().params['_id'];
		var templateOption = $('#loadTemplateOption').val();
		var quoteData = QuoteTemplates.findOne(templateOption);
		
		featureData = [];
		
		if(addto === true)
		{
			var comboData = {};
			var existingData = rebuildFeatureData();
			
			comboData = existingData.concat(quoteData.data);
		
			if(comboData.length)
			{
				featureData = uniqueFeatureIDs(comboData, 'top');
			}
			
		} else {
			
			if(quoteData.data.length)
			{
				featureData = uniqueFeatureIDs(quoteData.data, 'top');
			}
			
		}
		
		console.log(featureData);
		
		Quotes.update({ _id:thisQuoteID }, { $set : { 'features' : featureData } } );
		
	},

	'click .toggleEstModel': function (event) 
	{

		var thisItem = this.quote;
		
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
  		
  		Quotes.update( {_id:thisItem._id }, { $set : { estModel : whichModel   } } );

	},
	'change .quoteExtraToggle': function (event) 
	{
		
		var thisItem = this.quote;
		
		var isChecked = $(event.currentTarget).is(':checked');
		var whichValue = 'extra.' + $(event.currentTarget).attr('id');
		
		eval( 'Quotes.update( {_id:thisItem._id }, { $set : {  "' + whichValue + '" : isChecked   } } )');
		
	},
	'change .quoteExtraVal': function (event) 
	{
		
		var thisItem = this.quote;
		
		var thisValue = $(event.currentTarget).val();
		var whichValue = 'extra.' + $(event.currentTarget).attr('id');
		
		eval( 'Quotes.update( {_id:thisItem._id }, { $set : {  "' + whichValue + '" : ' + thisValue + ' } } )');
		
	},
	
});

function uniqueFeatureIDs(existingData, parent)
{
	var cleanData = [];
	
	existingData.forEach(function (doc) { 
		
		var newParent = parent;
		var newID = new Meteor.Collection.ObjectID().toHexString();
		
		doc.parent = parent;
		doc.feature_id = newID;
		
		if(doc.children != undefined && doc.children.length)
		{
			
			doc.children = uniqueFeatureIDs(doc.children, newID);
			
		}
		
		cleanData.push(doc);
		
	}); 
	
	return cleanData;
}

function rebuildFeatures()
{
	var thisQuoteID = Router.current().params['_id'];
	var featureArray = rebuildFeatureData();
	
	Quotes.update({ _id:thisQuoteID }, { $set : { 'features' : featureArray } } );
	
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
		
		var strategy = $(this).children('.feature-data').find('.strategy').text();
		var design = $(this).children('.feature-data').find('.design').text();
		var build = $(this).children('.feature-data').find('.build').text();
		
		
		if( experience && !isNaN(experience) ) { experience = parseFloat(experience); } else { experience = 0; }
		if( estimate && !isNaN(estimate) ) { estimate = parseFloat(estimate); } else { estimate = 0; }
		
		if( strategy && !isNaN(strategy) ) { strategy = parseFloat(strategy); } else { strategy = 0; }
		if( design && !isNaN(design) ) { design = parseFloat(design); } else { design = 0; }
		if( build && !isNaN(build) ) { build = parseFloat(build); } else { build = 0; }
		
		
		featureItem.experience	= experience;
		featureItem.estimate	= estimate;

		featureItem.estimateData	= {};
		featureItem.estimateData.strategy = strategy;
		featureItem.estimateData.design = design;
		featureItem.estimateData.build = build;
		
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
	
	return Math.round(sum * 100 ) / 100;
	
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
		
		var strategy = $(this).children('.feature-data').find('.strategy').text();
		var design = $(this).children('.feature-data').find('.design').text();
		var build = $(this).children('.feature-data').find('.build').text();
		
		if( experience && !isNaN(experience) ) { experience = parseFloat(experience); } else { experience = 0; }
		if( estimate && !isNaN(estimate) ) { estimate = parseFloat(estimate); } else { estimate = 0; }
		
		if( strategy && !isNaN(strategy) ) { strategy = parseFloat(strategy); } else { strategy = 0; }
		if( design && !isNaN(design) ) { design = parseFloat(design); } else { design = 0; }
		if( build && !isNaN(build) ) { build = parseFloat(build); } else { build = 0; }
		
		
		featureItem.experience	= experience;
		featureItem.estimate	= estimate;
		
		featureItem.estimateData	= {};
		featureItem.estimateData.strategy = strategy;
		featureItem.estimateData.design = design;
		featureItem.estimateData.build = build;
		
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