/* eslint-env node */
module.exports = {
  description: 'Generate sample utility functions needed for sitemaps.',

  normalizeEntityName: function(entityName){
    return entityName || 'utility-functions';
  },
};
