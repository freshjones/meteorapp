Template.request.rendered = function() {

	$('.highlighter').textHighlighter();

}

Template.request.events({

	'click .removeHighlights': function (event) 
	{
		event.preventDefault();
		$('.highlighter').getHighlighter().removeHighlights('.highlighter');
  	},
	'click .moveHighlights': function (event) 
	{
		event.preventDefault();
		var thisText = $('.highlighter').getHighlighter().getAllHighlights('.highlighter');

		console.log(thisText);

  	}
 });

 