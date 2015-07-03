import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    // After anyone transitions, catch the event and then ask active routes for information to build the contextual nav
    // TODO: I'm pretty sure this is a giant race.  Unsure what to do instead
    didTransition() {
      let info = {
        databaseModel: null,
        statement: null,
      };
      this.send('getContextualNav',info);
      this.get('controller').setProperties(info);
    },
    getContextualNav() { return true; }, // the buck stops here
  },
  model() {
    return Ember.$.getJSON('assets/directory.json');
  }
});
