# ember-cli-prerender

An Ember CLI addon for prerendering Ember.js apps and generating sitemaps.

## The problem

Applications that heavily use Javascript to render pages, like apps made with Ember.js or any other Javascript framework,

- suffer from long initial load and render times, specially on mobile devices with slower networks, because pages don't render until Javascript assets are loaded. This affects the **user experience** and consequently the **search engine ranking**.
- may not be crawled properly by search engines, even though search engine crawlers can now render Javascript to some extent.
- cannot have title, description and meta tags on a per page basis for social media and search engine crawler bots.

## The solution

When a Javascript application is prerendered, the intial render on the client-side can happen before the Javascript files are loaded and run. Faster initial render improves the user experience and the search engine ranking.

### Should I use this addon?

You should definitely use this addon if:

- **SEO matters.** You want to bring in organic traffic from search engines as much as possible.
- **UX matters.** You want your pages to render as fast as possible.
- **Social Media matters.** When you or other people share your content, you want to be able to customize what image, title and description is displayed on social media.
- **Content changes are always followed by a build.** As the prerendering with this addon happens on build time, you should NOT use it if your content changes without running a build. An example would be an app displaying frequently changing content from an API.
- **Not much personalization.** Most of your pages are not personalized and are showing the same content to all visitors.
- **Want to avoid server-side rendering.** You don't want to have to deploy and maintain a Node.js server-side app using [Fastboot](https://ember-fastboot.com/) and worry about caching, error handling and all the server-side issues.

### Features

- Easy installation. Most of the setup is done for you using a blueprint generator.
- Generates sitemap.txt and sitemap.xml.
    - The sitemaps can be submitted to [Google Search Console](https://www.google.com/webmasters/tools/home?hl=en) so Google starts indexing your pages as soon as they're published.
- Automatically scans all the routes. No need to manually enter your routes.
- Works with dynamic segments in routes ([Example](tests/dummy/app/utils/dynamic-segment-resolver.js)).
- Prerenders every page on the sitemap and generates HTML files.
    - Search engines will be able to scan all the content.
    - The initial load time will be much faster and this will improve the user experience significantly while giving your Ember app a SEO boost.
    - It's compatible with [ember-cli-head](https://github.com/ronco/ember-cli-head), so you can set title, description and meta tags per route for social media and search engine crawler bots ([Example](tests/dummy/app/routes/user.js)).
- The prerendering is really quick, because it happens asynchronously with throttling to minimize the prerendering time.
- You can exclude specific pages from being listed on the sitemap ([How](tests/dummy/app/utils/sitemap-entry-filter.js)). This is useful for hiding private routes, for example.
- Follows the [standard protocol](https://www.sitemaps.org/protocol.html) for XML sitemaps. `<loc>` tag is automatically added to the XML sitemap for each page. `<lastmod>`, `<changefreq>` and `<priority>` can be added as well ([Example](tests/dummy/app/utils/sitemap-entry-filter.js)).
- Compatible with the newest version of Ember (2.13).
- Compatible with the pod-based structure.
- Compatible with [FastBoot Shoebox](https://ember-fastboot.com/docs/user-guide#the-shoebox) ([Example](tests/dummy/app/routes/index.js)).
- [Full example](tests/dummy/app)
- Near 100% test coverage with unit, integration and acceptance tests

### Why not SSR? (server-side rendering)

These benefits can also be achieved with server-side rendering. [FastBoot](https://ember-fastboot.com/) can be used to render Ember.js apps on the server-side, but it has these drawbacks:

- FastBoot is not production-ready yet.
- It would require running a Node.js app on the server. Besides limiting your server options and increasing your costs, this introduces complexities such as caching and error logging.

This addon uses FastBoot when prerendering your app, but it uses it on buildtime instead of on runtime.

### Is this production-ready?

This addon is being used in production in the following websites:

- [MicroMech](https://micromech.net) (The new version that uses this addon is scheduled to launch to the public in a few weeks)
- [Declan Ramsay Portfolio](https://declanramsay.co.uk)

Are you using this addon in production as well? Edit [README.md](README.md) and add your site to this list!

## Usage

### Installation

- `ember install ember-cli-prerender`
- `ember generate sitemap-utils`
- `ember generate sitemap xml` (optional, for submitting to search engines)
- `ember generate sitemap txt` (required for the prerendering functionality to work)  
- If you're using [dynamic segments](https://guides.emberjs.com/v2.13.0/routing/defining-your-routes/#toc_dynamic-segments), edit `utils/dynamic-segment-resolver.js` so that it returns possible values for each dynamic segment ([Example](tests/dummy/app/utils/dynamic-segment-resolver.js)).
- Configure the addon in your `ember-cli-build.js`:
```js
  var app = new EmberApp(defaults, {
    'ember-cli-prerender': {
      sitemap: {

        /**
         * Your Ember app's internet address.
         * All relative paths in your sitemap will be prefixed with this.
         */
        rootUrl: 'https://mydummyapp.com/',

      },
    }
  });
```
- Add the following scripts to your `package.json`:
```json
{
  "scripts": {
    "build": "ember build",
    "postbuild": "ember prerender"
  }
}
```

### Prerendering

`npm run build`

This will build your app, prerender it and generate sitemap files along with prerendered HTML files in your `/dist` directory.

### Running the prerendered version

This is an optional step. If you would like to run the prerendered version locally, do the following:

- `npm install express-simple-static-server --save-dev`
- Add this script to your `package.json`:
```json
{
  "scripts": {
    "start-prerendered": "static-server dist"
  }
}
```
- `npm run start-prerendered`

### Upgrading

If you're using an older version of this addon and want to upgrade to the newest version, follow these steps:

1. `npm install --save-dev ember-cli-prerender`
1. `ember generate sitemap-utils` (Choose NOT to overwrite your files, if you already have the utils.)
1. `ember generate sitemap xml` (Only if you're using the XML sitemap)
1. `ember generate sitemap txt`
1. Run `ember server` and make sure your [sitemap.txt](http://localhost:4200/sitemap.txt) works.

### Optional settings for advanced usage

You most likely will not need to adjust any of the following settings.

Setting | Type | Default | Description
--- | --- | --- | ---
input-dir | String | dist | Change it if your app does not get built in the default `/dist` directory.
output-dir | String | dist | By default, the prerendered files are saved in your `/dist` folder. This option allows you to change that.
empty-output-dir | Boolean | false | If true, the prerendering script will clear the output directory before creating the prerendered files. Should be used in conjunction with `output-dir`.
max-simultaneous-url-fetches | Number | 4 | We throttle requests to our local Fastboot server so it doesn't get overloaded with too many async requests.
root-url | String |  | You can leave it blank if your app is located at the root-level on your domain. If your app is in a subfolder, this setting should match the `rootUrl` setting in your `ember-cli-build.js`.
sitemap-file-name | String | sitemap | The file name for the txt and xml sitemaps.
use-alternative-server | String | false | If you want to bypass using the prerender server and use one of your own

Example:

```shell
ember prerender --output-dir dist-static --empty-output-dir 1 --max-simultaneous-url-fetches 12
```

## Contribution

As with every other open-source project, contributions are appreciated!  

### Todos

- [ ] Blueprints should generate tests as well.
- [ ] Automated tests for files under `/lib/`

### Installation

1. `git clone` this repository
1. `npm install`

### Running

1. `npm start`
1. Visit the app at [http://localhost:4200](http://localhost:4200).

### Testing

* `npm test`
* `npm run test-watch`

### Building

* `npm run build`

### Running the prerendered version

* `npm run static-server`

## License

MIT
