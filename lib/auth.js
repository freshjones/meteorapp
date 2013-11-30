Router.map(function() { 

	this.route('login', {
		path: '/login',
		data:function(){
			return {
				isLoggedIn : Meteor.userId()
			}
		},
		controller: 'loginController',
		action: 'show'
	});

	this.route('logout', {
		path: '/logout',
		controller: 'logoutController',
		action: 'logout'
	});

});


logoutController = RouteController.extend({
	
	logout: function () 
	{
		var thisAction = this;
	 		
 		Meteor.logout(function (error) {

	        if(error) {

	          Session.set('entryError', error.reason);
	          Meteor.setTimeout(function() {
	                                                Session.set("entryError", null);
	                                        }, 3000);
	        } else {
	          
	          thisAction.redirect('login');

	        }

	    });
	  	
	}

});

loginController = RouteController.extend({
	
  show: function () 
  {
	  this.render();
  }

});