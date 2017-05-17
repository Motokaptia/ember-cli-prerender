import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  headData: Ember.inject.service(),
  afterModel() {
    const user = this.modelFor('user');
    Ember.set(this, 'headData.title', `Profile - ${user.name}`);
  },
});
