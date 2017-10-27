import Ember from 'ember';

export default Ember.Service.extend({
  sitemapEntryFilter: null,
  dynamicSegmentResolver: null,
  rootUrl: null,
  allRoutes: null,

  /**
   * Initialize the service. Try to add the sitemap settings and the routes automatically.
   */
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

  /**
   * Set the sitemap settings.
   *
   * @param  {object} settings
   */
  setSettings: function(settings) {
    if (settings) {
      if ('rootUrl' in settings) {
        this.set('rootUrl', settings.rootUrl);
      }
    }
  },

  /**
   * Set the routes.
   *
   * @param  {object} allRoutes An ember routes object.
   */
  setRoutes: function(allRoutes) {
    this.set('allRoutes', allRoutes);
  },

  /**
   * Optionally, can be used to filter all sitemap entries through a custom function.
   *
   * @param  {func} sitemapEntryFilter
   */
  setSitemapEntryFilter: function(sitemapEntryFilter) {
    this.set('sitemapEntryFilter', sitemapEntryFilter);
  },

  /**
   * Set a function that will resolve possible dynamic segment values
   *
   * @param  {func} dynamicSegmentResolver
   */
  setDynamicSegmentResolver: function(dynamicSegmentResolver) {
    this.set('dynamicSegmentResolver', dynamicSegmentResolver);
  },

  /**
   * Get the model for sitemap routes.
   *
   * @return {object} Promise returning an array of sitemap entry objects
   */
  getModel() {
    this._validate();

    const sitemapEntriesPromise = this._routesToSitemapEntries(this.get('allRoutes'));

    return sitemapEntriesPromise;
  },

  /**
   * Make sure all the required settings are set.
   */
  _validate() {
    if (!this.get('rootUrl')) {
      throw new Error(`sitemap.rootUrl is required`);
    }
    if (!this.get('allRoutes')) {
      throw new Error(`allRoutes are required`);
    }
  },

  /**
   * Transform an Ember routes object into an array of sitemap entry objects
   *
   * @param  {object} routes Ember routes object
   * @return {object} Promise returning sitemap entry objects
   */
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

  /**
   * If sitemapEntryFilter is set, uses it to filter a sitemap entry.
   *
   * @param  {object} entry
   * @param  {array} segments
   * @param  {object} dynamicSegments={}
   * @return {object} Promise returning the filtered sitemap entry
   */
  _filterSitemapEntry(entry, segments, dynamicSegments = {}) {
    const sitemapEntryFilter = this.get('sitemapEntryFilter');

    const result = sitemapEntryFilter ? sitemapEntryFilter(entry, segments, dynamicSegments) : entry;

    return Promise.resolve(result);
  },

  /**
   * Transform an Ember route object into a segments array.
   *
   * @param  {object} route
   * @return {object} An array of segments in the route
   */
  _routeToSegments(route) {
    return route.segments
      .filter(segment => [0, 1].includes(segment.type))
      .map(({type, value}) => (type === 1) ? `:${value}` : value); // Prefix dynamic segments with colon
  },

  /**
   * Converts a relative URL to an absolute URL.
   *
   * @param  {string} relativeUrl
   * @return {string} Absolute URL
   */
  _relativeToAbsoluteUrl(relativeUrl) {
    return this.get('rootUrl') + relativeUrl;
  },

  /**
   * Removes duplicate sitemap array entries. Duplicates exist because of index routes.
   *
   * @param  {array} entries
   * @return {array} Entries with duplicates removed
   */
  _removeDuplicateEntries(entries) {
    const newEntries = [];
    entries.forEach((entry) => {
      if (!newEntries.find(newEntry => newEntry.loc === entry.loc)) {
        newEntries.push(entry);
      }
    });
    return newEntries;
  },

  /**
   * Transforms a route object into a path string.
   *
   * @param  {object} route An Ember route object
   * @param  {object} dynamicSegments An object containing values for dynamic segments in the route
   * @return {string} Path (Ex: /photos)
   */
  _routeToPath(route, dynamicSegments) {
    let path = route.segments
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
      if(path[path.length-1]!="/"){
        path = path +"/";
      }
      return path;
  },

  /**
   * Extracts dynamic segments from an Ember route object.
   *
   * @param  {object} route An Ember route object
   * @return {array} An array of dynamic segment keys
   */
  _routeToDynamicSegments(route) {
    return route.segments
      .filter(segment => segment.type === 1)
      .map(segment => segment.value);
  },

  /**
   * Resolves possible values for a dynamic segment using the dynamicSegmentResolver function.
   *
   * @param  {string} dynamicSegmentKey
   * @param  {array} allSegments
   * @param  {object} otherDynamicSegments
   * @return {array} Possible values for the dynamic segment.
   */
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

  /**
   * Given a list of dynamic segments, returns an array of all the possible
   * permutations for the combination of those dynamic segments.
   * Since the number of dynamic segments is not limited or fixed, this function
   * is designed recursive.
   *
   * @param  {array} dynamicSegmentsKeys An array of dynamic segment key strings
   * @param  {array} segments An array of all segments in the route
   * @param  {permutation} permutation={} Used for passing the permutation in recursive calls
   * @return {array} An array of all the possible permutations (dynamic segment objects)
   */
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
