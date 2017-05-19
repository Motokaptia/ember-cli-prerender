import Ember from 'ember';
import dynamicSegmentResolver from '../utils/dynamic-segment-resolver';

export default Ember.Route.extend({
  sitemap: Ember.inject.service(),

  model() {
    const sitemap = this.get('sitemap');
    sitemap.setDynamicSegmentResolver(dynamicSegmentResolver);
    return sitemap.getModel();
  },
});
