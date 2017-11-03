module.exports = {
  name: 'prerender',
  aliases: [],
  description: 'Prerender the built app',
  works: 'insideProject',

  availableOptions: [
    { name: 'keep-fastboot', type: Boolean, default: false, aliases: [] },
    { name: 'input-dir', type: String, default: 'dist', aliases: [] },
    { name: 'output-dir', type: String, default: 'dist', aliases: [] },
    { name: 'empty-output-dir', type: Boolean, default: false, aliases: [] },
    { name: 'max-simultaneous-url-fetches', type: Number, default: 4, aliases: [] },
    { name: 'root-url', type: String, default: '', aliases: [] },
    { name: 'sitemap-file-name', type: String, default: 'sitemap', aliases: [] },
    { name: 'use-alternative-server', type: String, default: false, aliases:[]},
    { name: 'clean-urls', type: Boolean, default: true, aliases:[]}
  ],

  run: function(options = {}) {
    return require('../tasks/prerender')(options, this.project)();
  },
};
