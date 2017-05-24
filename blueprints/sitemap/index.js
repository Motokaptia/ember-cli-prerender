/* eslint-env node */
module.exports = {
  description: 'Generate txt and xml sitemaps.',

  normalizeEntityName: function(entityName){
    return entityName || 'sitemap';
  },

  afterInstall: function(options) {
    return this.insertIntoFile('app/router.js', `  this.route('${options.entity.name}-txt', { path: '${options.entity.name}.txt' });` +
          ` // Required by ember-cli-prerender\n` +
          `  this.route('${options.entity.name}-xml', { path: '${options.entity.name}.xml' }); // Optional\n`, {
        after: 'Router.map(function() {\n'
      })
      .then(() => this.ui.writeLine(`Added route ${options.entity.name}-txt to app/router.js`))
      .then(() => this.ui.writeLine(`Added route ${options.entity.name}-xml to app/router.js`));
  },
};
