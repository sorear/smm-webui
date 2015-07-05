import Ember from 'ember';

export default Ember.Controller.extend({
  roots: Ember.computed('model', function() { return this.get('model').database.outlineRoots; }),
});
