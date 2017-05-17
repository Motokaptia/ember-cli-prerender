import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  headData: Ember.inject.service(),
  afterModel(model) {
    Ember.set(this, 'headData.title', `Profile - ${model.name}`);
  },
  model({ user_id }) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${user_id}`)
      .then(response => response.json());
  }
});
