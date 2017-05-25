import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  headData: Ember.inject.service(),
  afterModel(model) {
    Ember.set(this, 'headData.title', `Photos - ${model.name}`);
  },
  model({ user_id }) {
    const user = this.modelFor('user');
    return fetch(`https://jsonplaceholder.typicode.com/users/${user_id}/photos`)
      .then(response => response.json())
      .then(photos => photos.slice(0, 25)) // Just reducing the size of the page
      .then(photos => {
        Ember.set(user, 'photos', photos);
        return user;
      });
  }
});
