
//managedUserForm
Template.user.permissions = function() {
        var permissions = new Array();
        _.keys(Meteor.ManagedUsers.availablePermissions()).forEach(function(k) {
                permissions.push({name: k, description: Meteor.ManagedUsers.availablePermissions()[k]});
        });
        return permissions;
}

Template.user.roles = function() {
    var roles = new Array();
    _.keys(Meteor.ManagedUsers.availableRoles()).forEach(function(k) {
            roles.push({key: k, value: Meteor.ManagedUsers.availableRoles()[k]});
    });
    return roles;
}

//managedUserEditModal
Template.user.helpers({
        editManagedUserError: function() {
                return Session.get("editManagedUserError");
        }
});

Template.user.clearForm = function() {
    $(".username").val("");
    $(".name").val("");
    $(".email").val("");
    $(".permission, .role").prop('checked', false);
    $(".password").val("");
}

Template.user.events({

        'click #submit': function(event) {
        		event.preventDefault();
                var self = this;
                
                var permissions = {};
                _.keys(Meteor.ManagedUsers.availablePermissions()).forEach(function(k) {
                        permissions[k] = $("#"+self._id+"_edit .permissions ."+k).prop('checked');
                });
    
                var roles = {};
                _.keys(Meteor.ManagedUsers.availableRoles()).forEach(function(k) {
                	roles[k] = $("#"+self._id+"_edit .roles ."+k).prop('checked');
                });
    
                Meteor.call('updateUser', self._id,
                        $("#"+self._id+"_edit .username").val(),
                        $("#"+self._id+"_edit .name").val(),
                        $("#"+self._id+"_edit .email").val(),
                        $("#"+self._id+"_edit .password").val(),
                        permissions,
                        roles,
                        function(error, result) {
                                if(error) {
                                        Session.set("editManagedUserError", error.reason);
                                        Meteor.setTimeout(function() {
                                                Session.set("editManagedUserError", null);
                                        }, 3000);
                                }
                                if(result) {
                                	Session.set("editManagedUserError", null);
                                    Router.go('users');
                                }
                        }
                );
        },

        'click #cancel': function (event) {
        	
        	event.preventDefault();
        	Router.go('users');
        }
});