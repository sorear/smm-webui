import Ember from 'ember';

export default Ember.Service.extend({
  width: window.innerWidth,
  height: window.innerHeight,
  init() {
    Ember.$(window).resize(() => {
      Ember.run(() => {
        this.setProperties({ width: window.innerWidth, height: window.innerHeight });
      });
    });
  }
});
