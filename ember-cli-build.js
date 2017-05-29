/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    'ember-cli-prerender': {
      sitemap: {

        /**
         * Your Ember app's internet address.
         * All relative paths in your sitemap will be prefixed with this.
         */
        rootUrl: 'https://mydummyapp.com/',

      },
    },
    'ember-cli-babel': {
      /**
       * Fix for es6 errors in phantomjs tests
       */
      includePolyfill: (EmberAddon.env() === 'test'),
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
