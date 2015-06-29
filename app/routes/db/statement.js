import Ember from 'ember';
import 'Scoper'; //TODO

export default Ember.Route.extend({
  model(params) {
    let db = this.modelFor('db').database;
    let sym = db.scoper.lookup(decodeURIComponent(params.name));
    return (sym && sym.labelled) || Ember.RSVP.reject('No such statement');
  },
  serialize(model) { return { name: encodeURIComponent(model.label) }; }
});
