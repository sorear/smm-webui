import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    getContextualNav(e) {
      e.statement = this.get('controller').get('model');
      return true;
    },
  },
  model(params) {
    let db = this.modelFor('db').database;
    let sym = db.scoper.lookup(decodeURIComponent(params.name));
    return (sym && sym.labelled) || Ember.RSVP.reject('No such statement');
  },
  serialize(model) { return { name: encodeURIComponent(model.label) }; }
});
