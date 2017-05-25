import Ember from 'ember';

export default Ember.Service.extend({
  dynamicSegmentResolver: null,
  rootUrl: null,

  init() {
    this._super(...arguments);

    const { sitemap } = Ember.getOwner(this).resolveRegistration('config:environment');

    this.set('rootUrl', sitemap.rootUrl);

    this._validate();
  },

  setDynamicSegmentResolver: function(dynamicSegmentResolver) {
    this.set('dynamicSegmentResolver', dynamicSegmentResolver);
  },

  getModel() {
    const router = Ember.getOwner(this).lookup('router:main');
    const allRoutes = router.get('_routerMicrolib.recognizer.names');
    const paths = this._routesToPaths(allRoutes, this.get('dynamicSegmentResolver'));

    return paths;
  },

  _validate() {
    if (!this.get('rootUrl')) {
      throw new Error(`sitemap.rootUrl is required`);
    }
  },

  _routesToPaths(routes, dynamicSegmentResolver) {
    const ignore = [
      'error',
      'loading',
      'application',
      'sitemap-txt',
      'sitemap-xml',
    ];

    const paths = [];

    Object.keys(routes).forEach((key) => {
      if (ignore.find(ignoredKey => key.indexOf(ignoredKey) > -1)) {
        return;
      }

      const dynamicSegmentsKeys = this._routeToDynamicSegments(routes[key]);
      if (dynamicSegmentsKeys.length === 0) { // No dynamic segments in route
        paths.push(this._routeToPath(routes[key]));
      } else {
        const permutations = this._dynamicSegmentsToPermutations(
          dynamicSegmentsKeys, dynamicSegmentResolver, this._routeToSegments(routes[key])
        );

        permutations.forEach(permutation =>
          paths.push(this._routeToPath(routes[key], permutation))
        );
      }
    });

    // Remove duplications caused by indexes
    return this._removeDuplicateArrayElements(paths)
      .map(path => this._relativeToAbsoluteUrl(path));
  },

  _routeToSegments(route) {
    return route.segments
      .filter(segment => [0, 1].includes(segment.type))
      .map(({type, value}) => (type === 1) ? `:${value}` : value); // Prefix dynamic segments with colon
  },

  _relativeToAbsoluteUrl(relativeUrl) {
    return this.get('rootUrl') + relativeUrl;
  },

  _removeDuplicateArrayElements(arr) {
    const newArr = [];
    arr.forEach((elem) => {
      if (newArr.indexOf(elem) === -1) {
        newArr.push(elem);
      }
    });
    return newArr;
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

  _dynamicSegmentsToPermutations(dynamicSegmentsKeys, dynamicSegmentResolver, segments, permutation = {}) {
    if (dynamicSegmentsKeys.length === 0) {
      return [];
    }

    const firstDynamicSegmentKey = dynamicSegmentsKeys[0];
    const remainingDynamicSegmentsKeys = dynamicSegmentsKeys.slice(1);

    const firstDynamicSegmentValues = dynamicSegmentResolver(firstDynamicSegmentKey, segments, permutation);

    if (!Array.isArray(firstDynamicSegmentValues)) {
      throw new Error(`The dynamic segment resolver returned a '${typeof firstDynamicSegmentValues}'` +
      ` instead of an array for '${firstDynamicSegmentKey}'.`);
    }

    const firstDynamicSegmentPermutations = firstDynamicSegmentValues.map(val => ({
      [firstDynamicSegmentKey]: val,
    }));

    const permutations = [];

    firstDynamicSegmentPermutations.forEach(firstDynamicSegmentPermutation => {
      const remainingDynamicSegmentsPermutations = this._dynamicSegmentsToPermutations(
        remainingDynamicSegmentsKeys,
        dynamicSegmentResolver,
        segments,
        Object.assign({}, permutation, firstDynamicSegmentPermutation)
      );

      if (remainingDynamicSegmentsPermutations.length > 0) {
        remainingDynamicSegmentsPermutations.forEach(remainingDynamicSegmentsPermutation => {
          permutations.push(Object.assign({}, firstDynamicSegmentPermutation, remainingDynamicSegmentsPermutation));
        });
      } else {
        permutations.push(firstDynamicSegmentPermutation);
      }
    });

    return permutations;
  },
});
