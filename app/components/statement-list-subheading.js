import Ember from 'ember';

export default Ember.Component.extend({
  properties: ['node','continued'],
  title: Ember.computed('node', function() {
    return this.get('node').title;
  }),
  slug: Ember.computed('node', function() {
    return this.get('node').slug;
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
  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, function(){
      Ember.$('.statement-list-subheading--header--chosen').each(function() { this.scrollIntoView(true); });
    });
  },
});
