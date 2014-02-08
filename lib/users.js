Meteor.ManagedUsers = {
        availablePermissions: function() {
                // Return an object of key/value pairs, like: {permissionName: "Permission Description", ....}
                // Do this in a file accessible by both the server and client.
                return {};
        },
        
        availableRoles: function() {
            // Return an object of key/value pairs, like: {permissionName: "Permission Description", ....}
            // Do this in a file accessible by both the server and client.
            return {"accountRep":"Account Rep", "manager":"Manager", "technician":"Technician"};
        },

        // Input Validation
        isAdmin: function() {
                return (Meteor.user() && (Meteor.user().username === "admin"));
        },

        checkUsername: function(username, userId) {
                if(!username)
                        throw new Meteor.Error(400, "Username can not be blank.");
                var usernamePattern = /^[a-z]+$/g;
                if(!usernamePattern.test(username))
                        throw new Meteor.Error(400, "Username format is incorrect.");
                var u = Meteor.users.findOne({username: username});
                if(u && (!userId || (u._id !== userId)))
                        throw new Meteor.Error(400, "Username already in use.");
        },

        checkEmailAddress: function(address, userId) {
                if(address) {
                        var emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i;
                        if(!emailPattern.test(address))
                                throw new Meteor.Error(400, "Email Address format is incorrect.");
                        var u = Meteor.users.findOne({emails: { $elemMatch: { address: address}}});
                        if(u && (!userId || (u._id !== userId)))
                                throw new Meteor.Error(400, "Email Address already in use.");
                }
        },

        hasPermission: function(permission) {
                if(Meteor.user() && ((Meteor.user().username === "admin") || (Meteor.user().permissions && Meteor.user().permissions[permission] == true)))
                        return true;
        }
        
}

// Do not allow account creation by just anyone
//Accounts.config({forbidClientAccountCreation: true});