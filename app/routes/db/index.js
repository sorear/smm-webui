import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() { this.transitionTo('db.list', this.modelFor('db')); },
});
