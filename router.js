if (Meteor.isClient) {

  Meteor.Router.add({
    '/': 'home',
    '/current': 'current',
    '/projects': 'projects',
    '/backlog': 'backlog',
    '/settings': 'settings'
  });
	
}
