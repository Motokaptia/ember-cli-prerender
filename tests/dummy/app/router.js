import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('user', { path: '/user/:user_id' }, function() {
    this.route('photos');
    this.route('photo', { path: '/photos/:photo_id' });
  });
});

export default Router;
