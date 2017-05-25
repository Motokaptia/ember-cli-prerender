/* eslint-env node */

const path = require('path');

module.exports = {
  description: 'Generate txt and xml sitemaps.',

  normalizeEntityName: function(entityName){
    if (!entityName) {
      entityName = 'txt'; // default value
    }
    if (!['txt', 'xml'].includes(entityName)) {
      throw new Error(`Your sitemap could be either txt or xml. The entered value (${entityName}) is invalid.`)
    }
    return `sitemap-${entityName}`;
  },

  fileMapTokens: function(options) {
    return {
      __routePath__: function(options) {
        if (options.pod) {
          return path.join(options.podPath, options.dasherizedModuleName);
        } else {
          return 'routes';
        }
      },
      __routeFileName__: function(options) {
        if (options.pod) {
          return 'route';
        } else {
          return options.dasherizedModuleName;
        }
      },
      __templatePath__: function(options) {
        if (options.pod) {
          return path.join(options.podPath, options.dasherizedModuleName);
        } else {
          return 'templates';
        }
      },
      __templateFileName__: function(options) {
        if (options.pod) {
          return 'template';
        } else {
          return options.dasherizedModuleName;
        }
      },
    }
  },

  locals: function(options) {
    return {
      sitemapComponent: options.entity.name,
    };
  },

  afterInstall: function(options) {

    let route;

    if (options.entity.name.substr(-4) === '-txt') {
      route = `  this.route('${options.entity.name}', { path: '${options.entity.name.replace('-txt', '.txt')}' }); // Required by ember-cli-prerender`;
    } else if (options.entity.name.substr(-4) === '-xml') {
      route = `  this.route('${options.entity.name}', { path: '${options.entity.name.replace('-xml', '.xml')}' }); // Optional`;
    }

    return this.insertIntoFile('app/router.js', route, {
      after: 'Router.map(function() {\n'
    })
    .then(() => this.ui.writeLine(`Added route ${options.entity.name} to app/router.js`));
  },
};
