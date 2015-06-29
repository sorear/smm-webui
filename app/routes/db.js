import Ember from 'ember';
import { parseAsync } from 'MMOM';

export default Ember.Route.extend({
  model(params) {
    let dir = this.modelFor('application');
    let db = dir.known_databases.filter(db => db.name === params.db)[0];
    if (db) {
      return parseAsync(db.database_url, url => Ember.RSVP.resolve(Ember.$.get(url))).then(db => ({ name: params.db, database: db }));
    }
    else {
      return Ember.RSVP.reject('No such database'); // TODO how do we error?
    }
  },
  serialize(model) { return { db: model.name }; },
});
