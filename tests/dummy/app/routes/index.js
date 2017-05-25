import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  headData: Ember.inject.service(),
  fastboot: Ember.inject.service(),
  afterModel() {
    Ember.set(this, 'headData.title', 'Home');
  },
  model() {
    const isFastBoot = this.get('fastboot.isFastBoot');
    const shoebox = this.get('fastboot.shoebox');
    let shoeboxStore = shoebox.retrieve('dummy-store');

    const modelFromShoebox = shoeboxStore && shoeboxStore['homepage'];

    if (isFastBoot || !modelFromShoebox) {
      return fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {
          if (isFastBoot) {
            if (!shoeboxStore) {
              shoeboxStore = {};
              shoebox.put('dummy-store', shoeboxStore);
            }
            shoeboxStore['homepage'] = users;
          }

          return users;
        });
    }

    return modelFromShoebox;
  }
});
