// Verify that the admin user account exists (should be created on the first run)
var u = Meteor.users.findOne({username: "admin"}); // find the admin user
if(!u) {
        Accounts.createUser({username: "admin", password: "oldgorilla", email: "super@freshjones.com", profile: {name: "Administrator"}});
}

Meteor.publish("systemUsers", function () {
	//if(this.userId)
	return Meteor.users.find({username: {$ne: "admin"}}, {sort: {userId: 1}, fields: {username: 1, profile: 1, emails: 1, permissions: 1}});
});

Meteor.methods({
	
        removeUser: function(userId) {
               // if(! Meteor.ManagedUsers.isAdmin())
                //        throw new Meteor.Error(401, "Only admin is allowed to do this.");
                //if(Meteor.user()._id === userId)
                //        throw new Meteor.Error(401, "Admin can not be removed.");
                Meteor.users.remove(userId);
                return true;
        },

        updateUser: function(userId, username, name, address, password, permissions) {
                //if(! Meteor.ManagedUsers.isAdmin())
                //        throw new Meteor.Error(401, "Only admin is allowed to do this.");
                Meteor.ManagedUsers.checkUsername(username, userId);
                if(!name)
                        throw new Meteor.Error(400, "Name can not be blank.");
                //if(!password)
                //    throw new Meteor.Error(400, "Password can not be blank.");
                Meteor.ManagedUsers.checkEmailAddress(address, userId);
                //if(Meteor.user()._id === userId) {
                //        username = "admin";
                //        name = "Administrator";
               // }
                if(address) {
                        address = new Array({address: address});
                } else {
                        address = null;
                }
                
                if(password)
                {
                	 
                	Meteor.users.update(userId, {$set: {
	                         username: username,
	                         profile: {name: name},
	                         emails: address,
	                         permissions: permissions
	                 }});
                	 
                } else {
                	 
                	Meteor.users.update(userId, {$set: {
	                         username: username,
	                         profile: {name: name},
	                         emails: address,
	                         password: password,
	                         permissions: permissions
	                 }});
	                	
                }
               
                return userId;
                
        },

        passwordReset: function(userId) {
               // if(! Meteor.ManagedUsers.isAdmin())
               //         throw new Meteor.Error(401, "Only admin is allowed to do this.");
                try {
                        Accounts.sendResetPasswordEmail(userId);
                } catch(e) {
                        throw new Meteor.Error(400, "Can't send email.");
                }
                return userId;
        },

        addUser: function(username, name, address, password, permissions) {
                //if(! Meteor.ManagedUsers.isAdmin())
                //        throw new Meteor.Error(401, "Only admin is allowed to do this.");
                Meteor.ManagedUsers.checkUsername(username);
                if(!name)
                        throw new Meteor.Error(400, "Name can not be blank.");
                Meteor.ManagedUsers.checkEmailAddress(address);
                var newUserId = Accounts.createUser({username: username, email: address, password: password, profile: {name: name}});
                //if(address)
                //        Accounts.sendEnrollmentEmail(newUserId);
                //Meteor.users.update(newUserId, {$set: {
                //        permissions: permissions
               // }});
                return newUserId;
        }
});