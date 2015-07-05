import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    getContextualNav(e) {
      e.isContents = true;
      return true;
    },
  },
});
