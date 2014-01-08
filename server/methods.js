Meteor.methods({

	addOutgoing: function(type, item_id)
	  {
		 
		var outgoingData = {};
		outgoingData.type = type;
		outgoingData.item_id = item_id;
		outgoingData.status = 'send';
		
		 //ditch all quote items 
		Outgoing.insert(outgoingData);
		
		return 'cool';
		  
	  }

});