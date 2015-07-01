import Ember from 'ember';
import { parseAsync } from 'smm';

export default Ember.Route.extend({
  actions: {
    getContextualNav(e) {
      e.databaseModel = this.get('controller').get('model');
      return true;
    },
  },
  model(params) {
    let dir = this.modelFor('application');
    let db = dir.known_databases.filter(db => db.name === params.db)[0];
    if (db) {
      return parseAsync(db.database_url, url => Ember.RSVP.resolve(Ember.$.get(url))).then(mmom => ({ name: params.db, database: mmom, title: db.title }));
    }
    else {
      return Ember.RSVP.reject('No such database'); // TODO how do we error?
    }
  },
  serialize(model) { return { db: model.name }; },
});
