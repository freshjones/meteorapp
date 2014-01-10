Meteor.methods({

	addOutgoing: function(type, itemData)
	  {
		 
		var randomCode =  Math.random().toString(36).slice(-8);
		
		var outgoingData 			= {};

		outgoingData.type 			= type;
		outgoingData.item_id 		= itemData.quote_id;
		outgoingData.to 			= itemData.to;
		outgoingData.subject 		= itemData.subject;
		outgoingData.coverletter 	= itemData.coverletter;
		outgoingData.status 		= 'send';
		
		//var hash = CryptoJS.MD5(salt + itemData.quotenum).toString();
		
		//var approvalCode = itemData.quote_id + randomCode;
		
		var quickTest = 'Billy Jones';
		
		//outgoingData.approval 	= approvalCode;
		
		var encrypted = CryptoJS.AES.encrypt('Billy', 'Test').toString(CryptoJS.enc.Base64);
		
		
		//var encryptedString = encrypted.toString();
		
		var decrypted = CryptoJS.AES.decrypt(encrypted, 'Test').toString(CryptoJS.enc.Base64);
		
		//var decrypted = CryptoJS.AES.decrypt(encrypted, "Passphrase").toString(CryptoJS.enc.Utf8);
		//we need to store the passkey in the quotes DB
		//Quotes.update({'_id':this.quote._id}, {$set:{'approvalCode':approvalCode}})
		
		//ditch all quote items 
		//Outgoing.insert(outgoingData);
		
		return decrypted;
		  
	  }

});