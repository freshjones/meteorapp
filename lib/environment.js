if (Meteor.isClient) {

  Meteor.Router.add({
    '/': 'home',
    '/iterations': 'iterations',
    '/projects': 'projects',
    '/backlog': 'backlog',
    '/settings': 'settings'
  });


}
