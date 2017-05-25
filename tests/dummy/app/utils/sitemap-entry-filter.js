// eslint-disable-next-line no-unused-vars
export default function sitemapEntryFilter(entry, segments, dynamicSegments = {}) {

  /**
   * Uncomment the line below and open localhost:4200/sitemap.txt on your browser.
   * You will see what parameters are passed to this function in the console.
   */
  // console.log('sitemapEntryFilter:', entry, segments, dynamicSegments);

  /**
   * If the function doesn't return anything, the entry will not be included in the sitemap.
   * This is useful for excluding private routes.
   */
  // return;

  // Let's add some additional attributes to the homepage entry
  if (entry.loc === '') {
    entry.lastmod = '2017-01-01';
    entry.changefreq = 'monthly';
    entry.priority = '0.8';
  }

  return entry;
}
