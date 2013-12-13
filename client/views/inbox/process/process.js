Template.inboxprocess.rendered = function() {
	
	$('.highlighter').textHighlighter();
	
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
  	'click .processitem-type': function (event) 
	{
  		event.preventDefault();
  		var thisType = $(event.currentTarget).attr('href');
  		Router.go('inboxprocess', {  _id:this._id, type:thisType.toLowerCase(), action:'add'  });

  	}
  	
 });