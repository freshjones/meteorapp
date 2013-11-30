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
		action: function () 
		{
			var thisAction = this;
			
			if( Meteor.userId() )
		  	{
		 		
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

		  	} else {

		  		thisAction.redirect('login');

		  	}
		}
	});

});


loginController = RouteController.extend({

  show: function () 
  {
  	if(this.isLoggedIn)
  	{
		this.redirect('logout');
  	} else {
  		this.render();
  	}
  	
  }

});