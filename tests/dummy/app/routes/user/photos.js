import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  model({ user_id }) {
    const user = this.modelFor('user');
    return fetch(`https://jsonplaceholder.typicode.com/users/${user_id}/photos`)
      .then(response => response.json())
      .then(arr => arr.slice(0, 10))
      .then(photos => {
        Ember.set(user, 'photos', photos);
        return user;
      });
  }
});
