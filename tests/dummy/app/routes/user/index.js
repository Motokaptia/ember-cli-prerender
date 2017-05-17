import Ember from 'ember';

export default Ember.Route.extend({
  headData: Ember.inject.service(),
  afterModel() {
    const user = this.modelFor('user');
    Ember.set(this, 'headData.title', `Profile - ${user.name}`);
  },
});
