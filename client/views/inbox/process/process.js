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
  		//var thisType = $(event.currentTarget).attr('href');
  		//Router.go('inboxprocess', {  _id:this._id, type:thisType.toLowerCase(), action:'add'  });
  	},
  	'click .archive': function (event) 
	{
  		event.preventDefault();
  		alert('your done right?');
  		//var thisType = $(event.currentTarget).attr('href');
  		//Router.go('inboxprocess', {  _id:this._id, type:thisType.toLowerCase(), action:'add'  });
  	},
  	'click .cancel': function (event) 
	{
  		event.preventDefault();
  		$('input, textarea').val('');
  		$('.checkbox input[type=checkbox]').prop('checked', false);
  		$('.ff-to-button').removeClass('btn-danger btn-success').addClass('btn-default');
  		$('.forward-container').addClass('hidden');
  		$('.form-group').removeClass('has-success has-error');
  		$('#ff-archive').val('no');
  		$('.ff-archive-btn').removeClass('btn-success');
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
  		
  		var thisDesc = $('#inbox-description').text();
  		$('#ff-description').val(thisDesc);
  		
  		$('.checkbox input[type=checkbox]').prop('checked', true);
  		
  		
  	},
  	'click .ff-archive-btn': function (event) 
	{
  		event.preventDefault();
  		var curArchiveVal = $('#ff-archive').val();
  		
  		switch(curArchiveVal)
  		{
  			case 'no':
  			default:
  				$('#ff-archive').val('yes');
  				$(event.currentTarget).removeClass('btn-default').addClass('btn-success');
  			break;
  			
  			case 'yes':
  				$('#ff-archive').val('no');
  				$(event.currentTarget).removeClass('btn-success').addClass('btn-default');
  			break;
  		}
  		
  	},
  	'click #ff-submit': function (event) 
	{
  		event.preventDefault();
  		
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
  				formEntry._id 			= thisID;
  				formEntry.to 			= $('#ff-to').val();
  				formEntry.title 		= $('#ff-title').val();
  				formEntry.sent 			= this.timest
  				formEntry.sender		= this.sender;
  				formEntry.description 	= $('#ff-description').val();
  				//formEntry.attachments 	= this.files;
  				
  				InboxProcessData.insert(formEntry);
  				
  	  		}
  	  		
  		}
  		
  	}
  	
 });