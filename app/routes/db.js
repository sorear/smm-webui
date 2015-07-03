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
      if (!db.promise) {
        let affixp = Ember.RSVP.resolve(db.affix_url ? Ember.$.get(db.affix_url) : '');
        db.promise = affixp.then(atext =>
          parseAsync(db.database_url,
            url => Ember.RSVP.resolve(Ember.$.get(url)).then(text => text + atext)))
          .then(mmom => ({ name: params.db, database: mmom, title: db.title }));
      }
      return db.promise;
    }
    else {
      return Ember.RSVP.reject('No such database'); // TODO how do we error?
    }
  },
  serialize(model) { return { db: model.name }; },
});
