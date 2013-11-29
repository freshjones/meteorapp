// Pass a user object, and get the email address
Handlebars.registerHelper('emailAddress', function(user) {
        if(user && user.emails)
                return user.emails[0].address;
});


//A shared Handlebars helper that returns true when the logged in user is "admin"
Handlebars.registerHelper('isAdmin', function() {
     return Meteor.ManagedUsers.isAdmin();
});

//The current user's full name
Handlebars.registerHelper('profileName', function() {
     if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.name)
             return Meteor.user().profile.name;
});

//Pass the permission name (as a string) to this helper
Handlebars.registerHelper('hasPermission', function(permission) {
     return Meteor.ManagedUsers.hasPermission(permission);
});