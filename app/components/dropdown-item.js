import Ember from 'ember';

export default Ember.Component.extend({
  properties: ['name','value','current'],
  tagName: 'li',
  classNameBindings: ['isActive:active'],

  isActive: Ember.computed('value', 'current', function () { return this.get('value') === this.get('current'); }),
  actions: {
    set() {
      this.set('current', this.get('value'));
    },
  },
});
