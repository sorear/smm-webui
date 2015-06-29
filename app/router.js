import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('invalid', {
    path: '/*wildcard'
  });
  this.route('db', { path: '/:db' }, function() {
    this.route('statement', { path: 'statement/:name' });
  });
  this.route('template');
});

export default Router;
