import { moduleFor, test } from 'ember-qunit';
import { routesWithoutDynamicSegments, routesWithDynamicSegments } from '../../helpers/sample-routes';

moduleFor('service:sitemap', 'Unit | Service | sitemap', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

const dummyRootUrl = 'https://dummyapp.com/';

test('its getModel method throws an error if rootUrl is not set', function (assert) {
  const service = this.subject();
  assert.throws(() => service.getModel(), /rootUrl/);
});

test('its getModel method throws an error if routes are not set', function (assert) {
  const service = this.subject();
  service.setSettings({ rootUrl: dummyRootUrl });
  assert.throws(() => service.getModel(), /allRoutes/);
});

test('its getModel method returns an array of entries when there are no dynamic segments', async function (assert) {
  const service = this.subject();
  service.setSettings({ rootUrl: dummyRootUrl });
  service.setRoutes(routesWithoutDynamicSegments);
  const model = await service.getModel();
  assert.equal(model.length, 1); // sitemap routes are excluded, so there's just 1 index route
  assert.equal(model[0].loc, dummyRootUrl); // index route entry
});

test('its getModel method returns an array of entries filtered with sitemapEntryFilter', async function (assert) {
  const service = this.subject();
  service.setSettings({ rootUrl: dummyRootUrl });
  service.setRoutes(routesWithoutDynamicSegments);
  service.setSitemapEntryFilter((entry, segments, dynamicSegments) => {
    assert.deepEqual(segments, []); // No segments in the index route
    assert.deepEqual(dynamicSegments, {}); // No dynamic segments in the index route
    if (entry.loc === '') {
      entry.lastmod = 'LASTMOD';
      entry.changefreq = 'CHANGEFREQ';
      entry.priority = 'PRIORITY';
    }
    return entry;
  });
  const model = await service.getModel();
  assert.equal(model.length, 1); // sitemap routes are excluded, so there's just 1 index route
  assert.equal(model[0].loc, dummyRootUrl); // index route entry
  assert.equal(model[0].lastmod, 'LASTMOD');
  assert.equal(model[0].changefreq, 'CHANGEFREQ');
  assert.equal(model[0].priority, 'PRIORITY');
});

test('its getModel method throws an error if there are dynamic segments but dynamicSegmentResolver is not set', async function (assert) {
  const service = this.subject();
  service.setSettings({ rootUrl: dummyRootUrl });
  service.setRoutes(routesWithDynamicSegments);
  try {
    await service.getModel();
  } catch(err) {
    assert.throws(() => { throw new Error(err); }, /dynamicSegmentResolver/);
  }
});

test('calls sitemapEntryFilter with the right parameters', async function (assert) {
  const service = this.subject();
  service.setSettings({ rootUrl: dummyRootUrl });
  service.setRoutes(routesWithDynamicSegments);
  service.setSitemapEntryFilter((entry, segments, dynamicSegments) => {
    if (entry.loc === 'user/7/photos/12') {
      assert.deepEqual(segments, ['user', ':user_id', 'photos', ':photo_id']);
      assert.deepEqual(dynamicSegments, { user_id: 7, photo_id: 12 });
    }
    return entry;
  });
  service.setDynamicSegmentResolver((dynamicSegmentKey) => {
    if (dynamicSegmentKey === 'user_id') {
      return [5, 6, 7];
    } else if (dynamicSegmentKey === 'photo_id') {
      return [10, 11, 12];
    } else {
      throw new Error(`Unknown dynamicSegmentKey '${dynamicSegmentKey}'`);
    }
  });
  await service.getModel();
});

test('calls dynamicSegmentResolver with the right parameters', async function (assert) {
  const service = this.subject();
  service.setSettings({ rootUrl: dummyRootUrl });
  service.setRoutes(routesWithDynamicSegments);
  service.setDynamicSegmentResolver((dynamicSegmentKey, allSegments, otherDynamicSegments, container) => {
    if (dynamicSegmentKey === 'photo_id') {
      assert.deepEqual(allSegments, ['user', ':user_id', 'photos', ':photo_id']);
      assert.deepEqual(otherDynamicSegments, { user_id: 1 });
      assert.equal(typeof container.lookup, 'function');
    }
    return [1];
  });
  await service.getModel();
});

test('its getModel method returns an array of entries when there are dynamic segments', async function (assert) {
  const service = this.subject();
  service.setSettings({ rootUrl: dummyRootUrl });
  service.setRoutes(routesWithDynamicSegments);
  service.setDynamicSegmentResolver(() => [1]);
  const model = await service.getModel();
  assert.deepEqual(model, [
    { loc: `${dummyRootUrl}user/1/photos` },
    { loc: `${dummyRootUrl}user/1/photos/1` },
    { loc: `${dummyRootUrl}user/1` },
    { loc: `${dummyRootUrl}` } ,
  ]);
});
