import Ember from 'ember';

export default Ember.Service.extend({
  sitemapEntryFilter: null,
  dynamicSegmentResolver: null,
  rootUrl: null,
  allRoutes: null,

  init() {
    this._super(...arguments);

    const envSettings = Ember.getOwner(this).resolveRegistration('config:environment');
    if (envSettings) {
      this.setSettings(envSettings.sitemap);
    }

    const router = Ember.getOwner(this).lookup('router:main');
    const allRoutes = router.get('_routerMicrolib.recognizer.names');
    if (allRoutes) {
      this.setRoutes(allRoutes);
    }
  },

  setSettings: function(settings) {
    if (settings) {
      if ('rootUrl' in settings) {
        this.set('rootUrl', settings.rootUrl);
      }
    }
  },

  setRoutes: function(allRoutes) {
    this.set('allRoutes', allRoutes);
  },

  setSitemapEntryFilter: function(sitemapEntryFilter) {
    this.set('sitemapEntryFilter', sitemapEntryFilter);
  },

  setDynamicSegmentResolver: function(dynamicSegmentResolver) {
    this.set('dynamicSegmentResolver', dynamicSegmentResolver);
  },

  getModel() {
    this._validate();

    const sitemapEntriesPromise = this._routesToSitemapEntries(this.get('allRoutes'));

    return sitemapEntriesPromise;
  },

  _validate() {
    if (!this.get('rootUrl')) {
      throw new Error(`sitemap.rootUrl is required`);
    }
    if (!this.get('allRoutes')) {
      throw new Error(`allRoutes are required`);
    }
  },

  _routesToSitemapEntries(routes) {
    const ignore = [
      'error',
      'loading',
      'application',
      'sitemap-txt',
      'sitemap-xml',
    ];

    let sitemapEntriesPromise = Promise.resolve([]);

    Object.keys(routes).forEach((key) => {
      if (ignore.find(ignoredKey => key.indexOf(ignoredKey) > -1)) {
        return;
      }

      const dynamicSegmentsKeys = this._routeToDynamicSegments(routes[key]);

      sitemapEntriesPromise = sitemapEntriesPromise.then((entries) => {
        if (dynamicSegmentsKeys.length === 0) { // No dynamic segments in route
          return this._filterSitemapEntry(
              { loc: this._routeToPath(routes[key]) },
              this._routeToSegments(routes[key])
            )
            .then(entry => entry ? [...entries, entry] : entries);
        } else {
          return this._dynamicSegmentsToPermutations(
            dynamicSegmentsKeys, this._routeToSegments(routes[key])
          ).then((permutations) => {
            let permutationsPromise = Promise.resolve(entries);

            permutations.forEach((permutation) => {
              permutationsPromise = permutationsPromise.then((entries) =>
                this._filterSitemapEntry(
                  { loc: this._routeToPath(routes[key], permutation) },
                  this._routeToSegments(routes[key]),
                  permutation
                )
                .then(entry => entry ? [...entries, entry] : entries)
              );
            });

            return permutationsPromise;
          });
        }
      });
    });

    return sitemapEntriesPromise
      .then(entries =>
        // Remove duplications caused by indexes
        this._removeDuplicateEntries(entries)
      )
      .then(entries =>
        // Map entry.loc from relative paths to absolute URLs
        entries.map((entry) => {
          entry.loc = this._relativeToAbsoluteUrl(entry.loc);
          return entry;
        })
      );
  },

  _filterSitemapEntry(entry, segments, dynamicSegments) {
    const sitemapEntryFilter = this.get('sitemapEntryFilter');

    const result = sitemapEntryFilter ? sitemapEntryFilter(entry, segments, dynamicSegments) : entry;

    return Promise.resolve(result);
  },

  _routeToSegments(route) {
    return route.segments
      .filter(segment => [0, 1].includes(segment.type))
      .map(({type, value}) => (type === 1) ? `:${value}` : value); // Prefix dynamic segments with colon
  },

  _relativeToAbsoluteUrl(relativeUrl) {
    return this.get('rootUrl') + relativeUrl;
  },

  _removeDuplicateEntries(entries) {
    const newEntries = [];
    entries.forEach((entry) => {
      if (!newEntries.find(newEntry => newEntry.loc === entry.loc)) {
        newEntries.push(entry);
      }
    });
    return newEntries;
  },

  _routeToPath(route, dynamicSegments) {
    return route.segments
      .filter(segment => segment.type === 0 || segment.type === 1)
      .map(segment => {
        if (segment.type === 0) { // static
          return segment.value;
        } else if (segment.type === 1) { // dynamic
          if (segment.value in dynamicSegments) {
            return dynamicSegments[segment.value];
          } else {
            throw new Error(`The value for dynamic segment '${segment.value}' is not set.`);
          }
        }
      })
      .join('/');
  },

  _routeToDynamicSegments(route) {
    return route.segments
      .filter(segment => segment.type === 1)
      .map(segment => segment.value);
  },

  _resolveDynamicSegment(dynamicSegmentKey, allSegments, otherDynamicSegments) {
    const dynamicSegmentResolver = this.get('dynamicSegmentResolver');

    if (!dynamicSegmentResolver) {
      throw new Error('dynamicSegmentResolver is required but is not set.');
    }

    const result = dynamicSegmentResolver(dynamicSegmentKey, allSegments, otherDynamicSegments);

    return Promise.resolve(result)
      .then(values => {
        if (!Array.isArray(values)) {
          throw new Error(`The dynamic segment resolver returned a '${typeof values}'` +
          ` instead of an array for '${dynamicSegmentKey}'.`);
        }

        return values;
      });
  },

  _dynamicSegmentsToPermutations(dynamicSegmentsKeys, segments, permutation = {}) {
    if (dynamicSegmentsKeys.length === 0) {
      return Promise.resolve([]);
    }

    const firstDynamicSegmentKey = dynamicSegmentsKeys[0];
    const remainingDynamicSegmentsKeys = dynamicSegmentsKeys.slice(1);

    return this._resolveDynamicSegment(firstDynamicSegmentKey, segments, permutation)
      .then((firstDynamicSegmentValues) => {
        const firstDynamicSegmentPermutations = firstDynamicSegmentValues.map(val => ({
          [firstDynamicSegmentKey]: val,
        }));

        let permutationsPromise = Promise.resolve([]);

        firstDynamicSegmentPermutations.forEach((firstDynamicSegmentPermutation) => {
          permutationsPromise = permutationsPromise.then(permutations => {
            if (remainingDynamicSegmentsKeys.length > 0) {
              return this._dynamicSegmentsToPermutations(
                remainingDynamicSegmentsKeys,
                segments,
                Object.assign({}, permutation, firstDynamicSegmentPermutation)
              ).then((remainingDynamicSegmentsPermutations) => {
                if (remainingDynamicSegmentsPermutations.length > 0) {
                  remainingDynamicSegmentsPermutations.forEach(remainingDynamicSegmentsPermutation => {
                    permutations.push(Object.assign({}, firstDynamicSegmentPermutation, remainingDynamicSegmentsPermutation));
                  });
                } else {
                  permutations = [];
                }
                return permutations;
              })
            } else {
              permutations.push(firstDynamicSegmentPermutation);
              return permutations;
            }
          })
        });

        return permutationsPromise;
      });
  },
});
