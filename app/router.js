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
    this.route('list');
    this.route('toc');
    this.route('fulltoc');
    this.route('statement', { path: 'statement/:name' });
  });
});

export default Router;
