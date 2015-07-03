import Ember from 'ember';

export default Ember.Controller.extend({
  properties: ['database', 'databaseName', 'statement'],

  prefs: Ember.inject.service(),
});
