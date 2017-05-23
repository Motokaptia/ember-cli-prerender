/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-prerender',

  init(parent, project) {
    this._super.init && this._super.init.apply(this, arguments);

    this.addonOptions = {}; // Making sure it's not undefined
  },

  /**
   * Grab the build configuration object
   *
   * @param {object} app
   */
  included(app) {
    this._super.included.apply(this, arguments);

    const { sitemap } = app.options['ember-cli-prerender'];

    this.addonOptions = {
      sitemap: Object.assign({
        rootUrl: null,
      }, sitemap),
    };
  },

  /**
   * Set the environment configuration object
   *
   * @param {string} env
   * @param {object} config
   */
  config(env, config) {
    var conf = {
      sitemap: Object.assign({}, this.addonOptions.sitemap, config.sitemap),
    };

    return conf;
  },

  /**
   * Add the prerender command
   */
  includedCommands: function() {
    return {
      'prerender': require('./lib/commands/prerender'),
    };
  },
};
