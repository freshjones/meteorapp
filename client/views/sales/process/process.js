Template.salesprocess.rendered = function() {
	
	$('#ff-form').parsley({
		    errors: {
		        classHandler: function ( element, isRadioOrCheckbox ) {
		            return $( element ).parents('.form-group');
		        },
		        container: function (element, isRadioOrCheckbox) {
		            var $container = element.parents('.form-group');
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

Template.salesprocess.events({
	
	'click .back': function (event) 
	{
  		event.preventDefault();
  		var thisInbox = Router.current().params['inbox'];
  		Router.go('sales', {inbox:thisInbox});
  	},
  	'click .archive': function (event) 
	{
  		event.preventDefault();
  		var thisItem 		= this;
  		var thisItemID		= thisItem.thisInboxItem._id;
  		var itemForwards 	= salesProcessData.find({inbox_id:thisItemID}).fetch();
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
  		
  		Router.go('salesprocess', { inbox:thisInbox, _id:thisInboxItem._id, action:'new', type:type });
  		
  		//$('.forward-container').removeClass('hidden');
  		//$('.forward-button .btn').addClass('hidden');
  	},
  	'click .forward': function (event) 
	{
  		event.preventDefault();
  		
  		var thisInboxItem = this.thisInboxItem;
  		
  		Router.go('salesprocess', {  _id:thisInboxItem._id, action:'new' });
  		
  		//$('.forward-container').removeClass('hidden');
  		//$('.forward-button .btn').addClass('hidden');
  	},
  	'click .cancel': function (event) 
	{
  		event.preventDefault();
  		var thisInboxItem = this.thisInboxItem;
  		Router.go('salesprocess', {  _id:thisInboxItem._id });
  		//clearForwardForm();
  	},
  	'click .copyAll': function (event) 
	{
  		event.preventDefault();
  		
  		var thisTitle = $('#inbox-title').text();
  		$('#ff-title').val(thisTitle);
  		
  		var thisDesc = $('#inbox-description').html();
  		
  		thisDescString = $.trim(thisDesc)
  		thisDescString = thisDescString.replace(/<br[^>]*>/gi, "\n");
  		
  		$('#ff-description').val( thisDescString );
  		
  		$('.checkbox input[type=checkbox]').prop('checked', true);
  		
  		
  	},
  	'click .ff-to-button': function (event) 
	{
  		event.preventDefault();
  		var thisInboxItem = this.thisInboxItem;
  		var to = $(event.currentTarget).attr('data-ff-to');
  		
  		Router.go('salesprocess', {  _id:thisInboxItem._id, action:'new', type:to });
  		
  		//$('#ff-to').val(to).parents('.form-group').removeClass('has-error').addClass('has-success');
  		//$('.ff-to-button').removeClass('btn-danger btn-success').addClass('btn-default');
  		//$(event.currentTarget).removeClass('btn-default btn-danger').addClass('btn-success');
  		
  	},
  	'click #ff-submit': function (event) 
	{
  		event.preventDefault();

  		var thisInboxItem = this.thisInboxItem;
  		var thisInbox = Router.current().params['inbox'];
  		var thisAttachments = thisInboxItem.attachments;
  		var isValid = false;
  		var toValue = $('#ff-to').val();
  		
  		if(toValue.length <= 0)
  		{
  			$('#ff-to').parents('.form-group').addClass('has-error');
  			
  			$('.ff-to-button').removeClass('btn-default').addClass('btn-danger');
  			
  			$('#ff-form').parsley('validate');
  			
  		} else {
  			
  			isValid = $('#ff-form').parsley('validate');
  		
  			if(isValid)
  	  		{
  				
  				var thisID = new Meteor.Collection.ObjectID();
  				
  				var formEntry 			= {};
  				formEntry._id 			= thisID.toHexString();
  				formEntry.inbox_id 		= thisInboxItem._id;
  				formEntry.to 			= $('#ff-to').val();
  				formEntry.title 		= $('#ff-title').val();
  				formEntry.sent 			= thisInboxItem.sent;
  				formEntry.sender		= thisInboxItem.sender;
  				formEntry.description 	= $('#ff-description').val();
  				formEntry.type 			= $('input[name="type"]:checked').val();
  				
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
  				
  				salesProcessData.insert(formEntry);
  				
  				Router.go('salesprocess', {  inbox:thisInbox, _id:thisInboxItem._id });
  				
  				//clearForwardForm();

  	  		}
  	  		
  		}
  		
  	}
  	
});


Template.salesProcessSummary.events({
	
	'click .ff-summaryitem': function (event) 
	{
  		event.preventDefault();
  		
  		salesProcessData.remove({_id : this._id});
  		
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
		Sales.update( {_id:inboxItem._id }, { $set : { status : "archive" } } );
		
	} else {
		
		//ok we need to process the action items
		summaryData.forEach(function(eachItem){
			
			var actionItem 			     = {};
			actionItem.status 		   = eachItem.to;
			actionItem.attachments 	 = eachItem.attachments;
			actionItem.description 	 = eachItem.description;
			actionItem.inbox_id 	   = eachItem.inbox_id;
			actionItem.sender 		   = eachItem.sender;
			actionItem.sent 		     = eachItem.sent;
			actionItem.title 		     = eachItem.title;
			actionItem.type 			   = eachItem.type;
			
      Sales.insert(actionItem);

		});
		
		Sales.update( {_id:inboxItem._id }, { $set : { status : "archive" } } );
		
	}
	
	Router.go('sales', {inbox:thisInbox});

}


var clearForwardForm = function()
{
	$('input, textarea').val('');
	$('.checkbox input[type=checkbox]').prop('checked', false);
	$('.ff-to-button').removeClass('btn-danger btn-success').addClass('btn-default');
	$('.form-group').removeClass('has-success has-error');
	$('.forward-container').addClass('hidden');
	$('.forward-button .btn').removeClass('hidden');
}