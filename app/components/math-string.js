import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  concatenated: Ember.computed('unparsed', function () {
    return this.get('unparsed').join(' ');
  }),
});
