Template.serviceprocess.rendered = function() {
	
	$('.btn-tooltip').tooltip({placement:'top', delay: { show: 900} }); //initialize all tooltips in this template

	$('#ff-form').parsley({
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
	
}

Template.serviceprocess.events({
	
	'click .back': function (event) 
	{
  		event.preventDefault();
  		var thisInbox = Router.current().params['inbox'];
  		Router.go('service', {inbox:thisInbox});
  	},
  	'click .archive': function (event) 
	{
  		event.preventDefault();
  		var thisItem 		= this;
  		var thisItemID		= thisItem.thisInboxItem._id;
  		var itemForwards 	= serviceProcessData.find({inbox_id:thisItemID}).fetch();
  		var numForwards 	= itemForwards.length;
  		
  		if(numForwards <= 0)
  		{
  			
	  		var dialogMsg = '';
	  		dialogMsg += '<p>You are about to archive this message with <strong>No</strong> action items.</p>';
	  		dialogMsg += '<p>Are you sure this is what you wanted to do?</p>';
	  			
	  		bootbox.confirm(dialogMsg, function(result) {
	  				
	  			if(result)
	  			{
	  				archiveInboxItem(thisItem);
	  			}
	
	  		});
	  	
  		} else {
  			
  			archiveInboxItem(thisItem);
  			
  		}
  		
  	},
  	'click .action': function (event) 
	{
  		event.preventDefault();
  		var thisInboxItem = this.thisInboxItem;
  		var thisInbox = Router.current().params['inbox'];
  		var type = $(event.currentTarget).attr('data-action');
  		
  		Router.go('serviceprocess', { inbox:thisInbox, _id:thisInboxItem._id, action:'new', type:type });
  		
  		//$('.forward-container').removeClass('hidden');
  		//$('.forward-button .btn').addClass('hidden');
  	},
  	'change .selectCompany': function (event) 
	{
  		event.preventDefault();
  		var curParams = Router.current().params;
  		var whichCompany = $(event.currentTarget).val();
  		var queryString = {};
  		
  		if(whichCompany != '')
  		{
  			queryString.company = whichCompany;
  		}
  		
  		Router.go('serviceprocess', curParams, {query: queryString });
  		
	},
	'click .cancel': function (event) 
	{
  		event.preventDefault();
  		var thisInboxItem = this.thisInboxItem;
  		var thisInbox = Router.current().params['inbox'];
  		Router.go('serviceprocess', {  inbox:thisInbox, _id:thisInboxItem._id });
  		
  	},
  	'click #ff-submit': function (event) 
	{
  		event.preventDefault();

  		var thisInboxItem = this.thisInboxItem;
  		var thisInbox = Router.current().params['inbox'];
  		var thisAttachments = thisInboxItem.attachments;
  		var isValid = false;
  
  		isValid = $('#ff-form').parsley('validate');
  		
		if(isValid)
  		{
			
			var thisID = new Meteor.Collection.ObjectID();
			
			var formEntry 			= {};
			formEntry._id 			= thisID.toHexString();
			formEntry.inbox_id 		= thisInboxItem._id;
			formEntry.to 			= $('#ff-to').val();
			formEntry.sent 			= thisInboxItem.sent;
			formEntry.sender		= thisInboxItem.sender;
			
			formEntry.title 		= $('#ff-title').val();
			formEntry.description 	= $('#ff-description').val();
			formEntry.purpose	 	= $('#ff-purpose').val();
			formEntry.project	 	= $('#ff-project').val();
			formEntry.company	 	= $('#ff-company').val();
			
			formEntry.attachments 	= [];
			
			if($('input.ff-attachment[type=checkbox]:checked').length)
			{
				
				$('input.ff-attachment[type=checkbox]:checked').each(function(i){
  					
					var attachment_id = $(this).val();
  					
  					thisAttachments.forEach(function(eachAttach)
  				{
  					if(eachAttach._id === attachment_id)
  					{
  						formEntry.attachments.push(eachAttach);
  					}
  				});
  					
  				});
				
			}
			
			serviceProcessData.insert(formEntry);
			
			Router.go('serviceprocess', {  inbox:thisInbox, _id:thisInboxItem._id });
			
  		}
  		
  	}
  	
});



var archiveInboxItem = function(data)
{
	var thisInbox = Router.current().params['inbox'];
	var summaryData = data.summaryData;
	var inboxItem = data.thisInboxItem;

	if(summaryData.length <= 0)
	{
		
		//ok we just need to archive this item
		Service.update( {_id:inboxItem._id }, { $set : { status : "archive" } } );
		
	} else {
		
		//ok we need to process the action items
		summaryData.forEach(function(eachItem){
			
			var actionItem 			    = {};
			actionItem.status 		  	= eachItem.to;
			actionItem.attachments 	 	= eachItem.attachments;
			actionItem.description 	 	= eachItem.description;
			actionItem.purpose 	 		= eachItem.purpose;
			actionItem.inbox_id 	   	= eachItem.inbox_id;
			actionItem.sender 		   	= eachItem.sender;
			actionItem.sent 		    = eachItem.sent;
			actionItem.title 		    = eachItem.title;
			actionItem.company 			= eachItem.company;
			actionItem.project 			= eachItem.project;
			
			Service.insert(actionItem);

		});
		
		Service.update( {_id:inboxItem._id }, { $set : { status : "archive" } } );
		
	}
	
	Router.go('service', {inbox:thisInbox});

}