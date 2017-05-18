import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  headData: Ember.inject.service(),
  afterModel(model) {
    Ember.set(this, 'headData.title', `${model.name}'s Photo - ${model.photo.title}`);
  },
  model({ photo_id }) {
    const user = this.modelFor('user');
    return fetch(`https://jsonplaceholder.typicode.com/photos/${photo_id}`)
      .then(response => response.json())
      .then(photo => {
        Ember.set(user, 'photo', photo);
        return user;
      });
  }
});
