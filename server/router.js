Router.map(function () {
  this.route('addrequest', {
    where: 'server',
    action: function () {

    	console.log( this['request'] );
    	
    	var insertData = {};
    	insertData.status = 'active';
    	insertData.description = this['request']['body']['body-plain'];
    	insertData.subject = this['request']['body']['subject'];
    	insertData.attachments = this['request']['body']['attachments'];
    	
    	Requests.insert(insertData );
    	
    	this.response.writeHead(200, {'Content-Type': 'text/html'});
    	this.response.end('received');
    }
  });
});