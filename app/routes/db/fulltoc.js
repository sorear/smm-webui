import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    getContextualNav(e) {
      e.isFullContents = true;
      return true;
    },
  },
});
