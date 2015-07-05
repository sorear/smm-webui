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

  prev: Ember.computed('node', function() {
    let node = this.get('node'), prev = node.ordinal > 1 ? node.siblings[node.ordinal - 2] : null;
    return prev ? Ember.Object.create({ slug: prev.slug, title: prev.title }) : null;
  }),

  next: Ember.computed('node', function() {
    let node = this.get('node'), next = node.ordinal > 0 ? node.siblings[node.ordinal] : null;
    return next ? Ember.Object.create({ slug: next.slug, title: next.title }) : null;
  }),

  up: Ember.computed('node', function() {
    let node = this.get('node'), up = node.parent;
    return up ? Ember.Object.create({ slug: up.slug, title: up.title }) : null;
  }),

  children: Ember.computed('node', function() {
    let ch = this.get('node').children;
    return ch.length ? ch : null;
  }),

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, function(){
      Ember.$('.statement-list-subheading--header--chosen').each(function() { this.scrollIntoView(true); });
    });
  },
});
