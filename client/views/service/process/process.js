Template.serviceprocess.rendered = function() {
	
	$('.btn-tooltip').tooltip({placement:'top', delay: { show: 900} }); //initialize all tooltips in this template

	
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
			actionItem.inbox_id 	   	= eachItem.inbox_id;
			actionItem.sender 		   	= eachItem.sender;
			actionItem.sent 		    = eachItem.sent;
			actionItem.title 		    = eachItem.title;
			actionItem.type 			= eachItem.type;
			
			Service.insert(actionItem);

		});
		
		Service.update( {_id:inboxItem._id }, { $set : { status : "archive" } } );
		
	}
	
	Router.go('service', {inbox:thisInbox});

}