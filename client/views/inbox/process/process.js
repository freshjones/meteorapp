Template.inboxprocess.rendered = function() {
	
	$('.highlighter').textHighlighter();
	
	$('#ff-form').parsley({
		    errors: {
		        classHandler: function ( elem, isRadioOrCheckbox ) {
		            return $( elem ).parents('.form-group');
		        }
		    },
		    successClass: 'has-success', 
		    errorClass: 'has-error'
		});
	
}

Template.inboxprocess.events({

	'click .removeHighlights': function (event) 
	{
		event.preventDefault();
		$('.highlighter').getHighlighter().removeHighlights('.highlighter');
  	},
	'click .moveHighlights': function (event) 
	{
		event.preventDefault();
		var thisText = $('.highlighter').getHighlighter().serializeHighlights();

		console.log(thisText);

  	},
  	'click .forward': function (event) 
	{
  		event.preventDefault();
  		$('.forward-container').removeClass('hidden');
  		$('.forward-button .btn').addClass('hidden');
  		//var thisType = $(event.currentTarget).attr('href');
  		//Router.go('inboxprocess', {  _id:this._id, type:thisType.toLowerCase(), action:'add'  });
  	},
  	'click .back': function (event) 
	{
  		event.preventDefault();
  		Router.go('inbox');
  	},
  	'click .archive': function (event) 
	{
  		event.preventDefault();
  		var thisItem 		= this;
  		var thisItemID		= thisItem.thisInboxItem._id;
  		var itemForwards 	= InboxProcessData.find({inbox_id:thisItemID}).fetch();
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
  		
  		//var thisType = $(event.currentTarget).attr('href');
  		//Router.go('inboxprocess', {  _id:this._id, type:thisType.toLowerCase(), action:'add'  });
  	},
  	'click .cancel': function (event) 
	{
  		event.preventDefault();
  		clearForwardForm();
  	},
  	'click .ff-to-button': function (event) 
	{
  		event.preventDefault();
  		var to = $(event.currentTarget).attr('data-ff-to');
  		
  		$('#ff-to').val(to).parents('.form-group').removeClass('has-error').addClass('has-success');
  		
  		$('.ff-to-button').removeClass('btn-danger btn-success').addClass('btn-default');
  		
  		$(event.currentTarget).removeClass('btn-default btn-danger').addClass('btn-success');
  		
  		
  	},
  	'click .copyAll': function (event) 
	{
  		event.preventDefault();
  		
  		var thisTitle = $('#inbox-title').text();
  		$('#ff-title').val(thisTitle);
  		
  		var thisDesc = $('#inbox-description').html();
  		
  		thisDescString = $.trim(thisDesc)
  		thisDescString = thisDescString.replace(/<br[^>]*>/gi, "\n");
  		
  		$('#ff-description').val(thisDescString);
  		
  		$('.checkbox input[type=checkbox]').prop('checked', true);
  		
  		
  	},
  	'click #ff-submit': function (event) 
	{
  		event.preventDefault();

  		var thisInboxItem = this.thisInboxItem;
  		var thisAttachments = thisInboxItem.files;
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
  				formEntry.sent 			= thisInboxItem.timestamp;
  				formEntry.sender		= thisInboxItem.sender;
  				formEntry.description 	= $('#ff-description').val();
  				
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
  				
  				InboxProcessData.insert(formEntry);
  				clearForwardForm();
  				
  	  		}
  	  		
  		}
  		
  	}
  	
 });

Template.inboxProcessSummary.events({
	
	'click .ff-summaryitem': function (event) 
	{
  		event.preventDefault();
  		
  		InboxProcessData.remove({_id : this._id});
  		
  	}
  	
});

var clearForwardForm = function()
{
	$('input, textarea').val('');
	$('.checkbox input[type=checkbox]').prop('checked', false);
	$('.ff-to-button').removeClass('btn-danger btn-success').addClass('btn-default');
	$('.form-group').removeClass('has-success has-error');
	$('.forward-container').addClass('hidden');
	$('.forward-button .btn').removeClass('hidden');
}

var archiveInboxItem = function(data)
{
	var summaryData = data.summaryData;
	var inboxItem = data.thisInboxItem;
	
	if(summaryData.length <= 0)
	{
		
		//ok we just need to archive this item
		Inbox.update( {_id:inboxItem._id }, { $set : { status : "archive" } } );
		
	} else {
		
		//ok we need to process the action items
		summaryData.forEach(function(eachItem){
			
			var actionItem 			= {};
			actionItem.status 		= 'active';
			actionItem.attachments 	= eachItem.attachments;
			actionItem.description 	= eachItem.description;
			actionItem.inbox_id 	= eachItem.inbox_id;
			actionItem.sender 		= eachItem.sender;
			actionItem.sent 		= eachItem.sent;
			actionItem.title 		= eachItem.title;
			actionItem.to 			= eachItem.to;
			
			switch(eachItem.to)
			{
				case 'sales':
					Sales.insert(actionItem);
				break;
				
				case 'service':
					Service.insert(actionItem);
				break;
			
			}
			
		});
		
		Inbox.update( {_id:inboxItem._id }, { $set : { status : "archive" } } );
		
	}
	
	Router.go('inbox');

}

	