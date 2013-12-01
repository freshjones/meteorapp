Router.map(function () 
{
	
  this.route('addrequest', 
  {
		where: 'server',
		action: function () {
		
			var insertData = {};
			insertData.status = 'active';
			insertData.description = this['request']['body']['description'];
			insertData.subject = this['request']['body']['subject'];
			insertData.timestamp = this['request']['body']['timestamp'];
			insertData.sender = this['request']['body']['sender'];
			insertData.files = this['request']['body']['files'];
			
			Requests.insert(insertData );
			
			this.response.writeHead(200, {'Content-Type': 'text/html'});
			this.response.end('received');
			
		}
  
  });
  
  this.route('sendemail', 
  {
	    where: 'server',
	    path: '/sendmail/:_id',
	    action: function () 
	    {
	    	
	    	var userData = Meteor.users.findOne(this.params._id);
	    	
	    	var emailAddress = userData.emails[0].address;
	    	var text = '';
	    	
	    	text += 'Username:' + userData.username + "\n";
	    	text += 'Full Name:' + userData.profile.name + "\n";
	    	text += 'Email: ' + emailAddress  + "\n";
	    	
	    	if(emailAddress)
	    	{
	    		Email.send({
	  	          to: 'billy@freshjones.com',
	  	          from: 'billy@freshjones.com',
	  	          subject: 'My Daily Todo List',
	  	          text: text
	  	        });
	    		
	    	}
	    	
	    }
	  
  });
  
});