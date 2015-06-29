import Ember from 'ember';

export default Ember.Controller.extend({
  label: function() { return this.get('model').label; }.property('model'),
  raw: function() { return this.get('model').raw; }.property('model'),
});
