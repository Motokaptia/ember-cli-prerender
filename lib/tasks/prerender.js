const path = require('path');
const FastBootAppServer = require('fastboot-app-server');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const throat = require('throat');

module.exports = (userOptions, project) => {
  const options = Object.assign({
    inputDir: 'dist',
    outputDir: 'dist',
    emptyOutputDir: false,
    maxSimultaneousUrlFetches: 4,
    rootUrl: '',
    sitemapFileName: 'sitemap',
    useAlternativeServer:false,
    cleanUrls:false
  }, userOptions);

  /**
   * Function for creating absolute paths
   */
  const pathJoin = function(){
    return path.join(project.root, ...arguments);
  };

  /**
   * Function for creating user-friendly paths for printing on the console
   */
  const userFriendlyPath = function(){
    return path.join(...arguments);
  };

  /**
   * Instantiate the Fastboot server
   */
  const localServer = new FastBootAppServer({
    distPath: pathJoin(options.inputDir),
    host:'0.0.0.0',
    port:3000
   });
  const localServerUrl = options.useAlternativeServer?options.useAlternativeServer:'http://localhost:3000';

  /**
   * Function for fetching URLs from the local server
   * @param {string} url
   */
  const fetchFromLocalServer = function(url) {
    const urlWithoutPath = url.slice(0, url.indexOf('/', 8));
    const localUrl = url.replace(options.rootUrl ? options.rootUrl : urlWithoutPath, localServerUrl);

    return fetch(localUrl)
      .then(res => {
        if (res.status === 404) {
          return 'not_found';
        } else if (res.status === 200) {
          return res.text();
        } else {
          throw new Error(`Invalid response code (${res.status}) from ${localUrl}`);
        }
      });
  };

  /**
   * Function for saving fetched files
   * @param {string} url
   * @param {string} body
   */
  const saveFile = function(url, body) {
    const urlWithoutPath = url.slice(0, url.indexOf('/', 8));
    const localUrl = url.replace(options.rootUrl ? options.rootUrl : urlWithoutPath, localServerUrl);
    const path = localUrl.replace(localServerUrl, '');
    const pathContainsFilename = path.indexOf('.') > -1;
    const localPath = pathContainsFilename ?
      pathJoin(options.outputDir, path) :
      pathJoin(options.outputDir, path, 'index.html');

    console.log("Saving : "+localPath);
    return fs.outputFile(localPath, body);
  };

  return () => {
    const startedAt = Date.now();
    const pagesPrerendered = 0;
    let error;

    /**
     * Make sure the input directory exists
     */
    if (!fs.pathExistsSync(pathJoin(options.inputDir))) {
      throw new Error(`The input directory '${options.inputDir}' does not exist.`);
    }
    if (!fs.pathExistsSync(pathJoin(options.inputDir, 'index.html'))) {
      throw new Error(`'${userFriendlyPath(options.inputDir, 'index.html')}' does not exist.`);
    }

    /**
     * Keep a backup of the not-prerendered index
     */
    const notPrerenderedIndex = fs.readFileSync(pathJoin(options.inputDir, 'index.html'), 'utf8');

    /**
     * Ensure the output directory exists
     */
    try {
      if (options.emptyOutputDir) {
        fs.emptyDirSync(pathJoin(options.outputDir));
      } else {
        fs.ensureDirSync(pathJoin(options.outputDir));
      }
    } catch (err) {
      error = err;
    }

    /**
     * Throw the error
     */
    if (error) {
      throw new Error(`Prerendering failed because of an error`, error);
    }

    /**
     * Start the Node rendering server
     */
    const startServer = localServer.start();

    /**
     * If startServer is a promise, this is the main thread.
     */
    if (startServer) {
      let downloadedPages = [];
      return startServer
        /**
         * Fetch the xml sitemap, if it exists
         */
        .then(() =>
          fetchFromLocalServer(`${localServerUrl}/${options.sitemapFileName}.xml`)
            .then((body) => {
              if (body !== 'not_found') {
                const regex = /id="sitemap\-xml">\n([^]*)\n<\/pre>/i;
                const found = body.match(regex);
                if (!found || found.length !== 2) {
                  throw new Error(`${options.sitemapFileName}.xml could not be processed.`)
                }
                const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n${found[1]}`;

                return saveFile(`${localServerUrl}/${options.sitemapFileName}.xml`, xmlContent);
              }
            })
        )
        /**
         * Fetch the txt sitemap
         */
        .then(() =>
          fetchFromLocalServer(`${localServerUrl}/${options.sitemapFileName}.txt`)
            .then((body) => {
              const regex = /id="sitemap\-txt">\n([^]*)\n<\/pre>/i;
              const found = body.match(regex);
              if (!found || found.length !== 2) {
                throw new Error(`${options.sitemapFileName}.txt could not be processed.`)
              }
              const urls = found[1].split('\n');

              return saveFile(`${localServerUrl}/${options.sitemapFileName}.txt`, found[1])
                .then(() => urls);
            })

        /**
         * Fetch all pages
         */
        .then((urls) =>
          Promise.all(
            urls.map(
              throat(options.maxSimultaneousUrlFetches,
                url => fetchFromLocalServer(url).then(body => downloadedPages.push({ url, body }))
              )
            )
          )
        )
        /**
         * Stop the server, because we don't need it anymore
         */
        .then(() => {
          localServer.stop();
        })
        /**
         * Save all the downloaded pages to the local file system
         * NOTE: This is throttled to one page at a time because it is writing
         * to the file system.
         */
        .then(() =>
          Promise.all(
            downloadedPages.map(
              options.cleanUrls?throat(1, page => saveFile(page.url+'.html', page.body)):throat(1, page => saveFile(page.url, page.body))
            )
          )
        )

        /**
         * Catch errors
         */
        .catch((err) => {
          console.log('Error occured - Aborting Prerendering', err);
          localServer.stop();
        })
        /**
         * Print how long prerendering took
         */
        .then(() => console.log(`Prerendering took ${Date.now() - startedAt}ms`)));
    }

    return new Promise(resolve => {}); // Workers should return an unresolved promise
  };
};
