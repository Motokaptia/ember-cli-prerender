module.exports = {
  name: 'prerender',
  aliases: [],
  description: 'Prerender the built app',
  works: 'insideProject',

  availableOptions: [
    { name: 'keep-fastboot', type: Boolean, default: false, aliases: ['fastboot'] },
    { name: 'input-dir', type: String, default: 'dist', aliases: ['input'] },
    { name: 'output-dir', type: String, default: 'dist', aliases: ['output'] },
    { name: 'empty-output-dir', type: Boolean, default: false, aliases: ['empty'] },
    { name: 'max-simultaneous-url-fetches', type: Number, default: 6, aliases: ['max-fetches'] },
    { name: 'root-url', type: String, default: '', aliases: ['url'] },
  ],

  run: function(options = {}) {
    return require('../tasks/prerender')(options, this.project)();
  },
};
