/* eslint-env node */
module.exports = {
  description: 'Generate txt and xml sitemaps.',

  normalizeEntityName: function(entityName){
    return entityName || 'sitemap';
  },

  afterInstall: function(options) {
    const routes = [
      `  this.route('${options.entity.name}-txt', { path: '${options.entity.name}.txt' }); // Required by ember-cli-prerender`,
      `\n  this.route('${options.entity.name}-xml', { path: '${options.entity.name}.xml' }); // Optional\n`,
    ];

    return this.ui.prompt({
        type: 'list',
        name: 'addRoutes',
        message: `How would you like to add the following sitemaps to your routes?\n\n${routes.join('')}\n`,
        choices: [
          { name: 'Automatic: Add them for me.', value: true },
          { name: 'Manual: I will add them myself.', value: false }
        ]
      })
      .then(({ addRoutes }) => {
        if (addRoutes) {
          return this.insertIntoFile('app/router.js', routes.join(''), {
              after: 'Router.map(function() {\n'
            })
            .then(() => this.ui.writeLine(`Added route ${options.entity.name}-txt to app/router.js`))
            .then(() => this.ui.writeLine(`Added route ${options.entity.name}-xml to app/router.js`));
        }
      })
      .then(() => this.ui.writeLine(`Sitemap generation is done.`));
  },
};
