import Ember from 'ember';

export default Ember.Component.extend({
  properties: ['node','continued'],
  title: Ember.computed('node', function() {
    return this.get('node').title;
  }),
  prologue: Ember.computed('node', function() {
    return this.get('node').prologue;
  }),
  level1: Ember.computed('node', function() {
    return this.get('node').level === this.get('node').statement.database.outlineLevelBase;
  }),
  level2: Ember.computed('node', function() {
    return this.get('node').level === this.get('node').statement.database.outlineLevelBase + 1;
  }),
  numberPath: Ember.computed('node', function() {
    return this.get('node').path.map(n => n.ordinal).join('.');
  }),
});
