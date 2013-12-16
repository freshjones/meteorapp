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
  	'click .forward': function (event) 
	{
  		event.preventDefault();
  		alert('hellow');
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
  	
 });