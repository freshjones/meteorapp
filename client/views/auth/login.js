Template.login.events({
  
  'submit #signIn': function (event) {
    event.preventDefault();
    Session.set('email', $('input[name="email"]').val())
    Session.set('password', $('input[name="password"]').val())
    
    Meteor.loginWithPassword(Session.get('email'), Session.get('password'), function (error) {
        if(error) {
          Session.set('entryError', error.reason);
          Meteor.setTimeout(function() {
                                                Session.set("entryError", null);
                                        }, 3000);
        } else {
          Router.go('myaccount');
        }
    });

  }

});


Template.entryError.helpers({

    error: function() {
      return Session.get('entryError');
    }

});


  