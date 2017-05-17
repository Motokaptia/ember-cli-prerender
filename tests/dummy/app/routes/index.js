import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  headData: Ember.inject.service(),
  afterModel() {
    Ember.set(this, 'headData.title', 'Home');
  },
  model() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json());
  }
});
