Template.inboxitem.rendered = function() {
	
	$('.highlighter').textHighlighter();
	
}

Template.inboxitem.events({

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

  	}
 });

 