import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  model() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json());
  }
});
