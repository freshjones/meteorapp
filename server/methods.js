Meteor.methods({

	addOutgoing: function(type, itemData)
	  {
		 
		var approvalCode 			=  Math.random().toString(36).slice(-8);
		
		var outgoingData 			= {};

		outgoingData.type 			= type;
		outgoingData.item_id 		= itemData.quote_id;
		outgoingData.to 			= itemData.to;
		outgoingData.subject 		= itemData.subject;
		outgoingData.coverletter 	= itemData.coverletter;
		outgoingData.status 		= 'send';
		outgoingData.approvalCode 	= itemData.quote_id + approvalCode;

		//we need to store the passkey in the quotes DB
		Quotes.update({'_id':itemData.quote_id}, {$set:{'approvalCode':approvalCode}})
		
		//ditch all quote items 
		Outgoing.insert(outgoingData);
		
		return 'cool';
		  
	  }

});