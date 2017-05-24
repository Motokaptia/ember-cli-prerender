# ember-cli-prerender

An Ember CLI addon for prerendering Ember.js apps and generating sitemaps. 

## The problem

Applications that heavily use Javascript to render pages, like apps made with Ember.js or any other Javascript framework,

- suffer from long initial load and render times, specially on mobile devices with slower networks, because pages don't render until Javascript assets are loaded. This affects the **user experience** and consequently the **search engine ranking**.
- may not be crawled properly by search engines, even though search engine crawlers can now render Javascript to some extent.
- cannot have title, description and meta tags on a per page basis for social media and search engine crawler bots.

## The solution

When a Javascript application is prerendered, the intial render on the client-side can happen before the Javascript files are loaded and run. Faster initial render improves the user experience and the search engine ranking.

### Features

- Easy installation. Most of the setup is done for you using a blueprint generator.
- Generates sitemap.txt and sitemap.xml.
    - The sitemaps can be submitted to [Google Search Console](https://www.google.com/webmasters/tools/home?hl=en) so Google starts indexing your pages as soon as they're published.
- Automatically scans all the routes. No need to manually enter your routes.
- Works with dynamic segments in routes.
- Prerenders every page on the sitemap and generates HTML files.
    - Search engines will be able to scan all the content.
    - The initial load time will be much faster and this will improve the user experience significantly while giving your Ember app a SEO boost.
    - It's compatible with [ember-cli-head](https://github.com/ronco/ember-cli-head), so you can set title, description and meta tags per route for social media and search engine crawler bots ([Example](tests/dummy/app/routes/user.js)).
- The prerendering is really quick, because it happens asynchronously with throttling to minimize the prerendering time.
- Compatible with the newest version of Ember (2.13).
- [Full example](tests/dummy/app)

### Upcoming features

- [ ] Compatible with pods.
- [ ] Blueprint will generate tests for the added routes, templates and util.
- [ ] Ability to generate a 404 error page.
- [ ] Implement [FastBoot Shoebox](https://ember-fastboot.com/docs/user-guide#the-shoebox) in the example.
- [ ] Ability to exclude pages from the sitemap (and consequently from prerendering). Useful for private routes.
- [ ] Ability to exclude pages from prerendering (but not from the sitemap). Basically, leaving the default index.html untouched for the excluded pages. Useful when trying to speed up the prerendering of thousands of pages.
- [ ] Pass the full route to the dynamic segment resolver function for more complex cases, like when two completely different routes have the same dynamic segments, but with different values.
- [ ] Ability to change the asset URLs when prerendering, for cases where the prerendered HTMLs will live on a different domain than the assets.
- [ ] Full automated test coverage.

### Why not SSR? (server-side rendering)

These benefits can also be achieved with server-side rendering. [FastBoot](https://ember-fastboot.com/) can be used to render Ember.js apps on the server-side, but it has these drawbacks:

- FastBoot is not production-ready yet.
- It would require running a Node.js app on the server. Besides limiting your server options and increasing your costs, this introduces complexities such as caching and error logging.

This addon uses FastBoot when prerendering your app, but it uses it on buildtime instead of on runtime.

### Is this production-ready?

This addon is being used in production in the following websites:

- [MicroMech](https://micromech.net) (The new version that uses this addon is scheduled to launch to the public in a few weeks)

Are you using this addon in production as well? Edit [README.md](README.md) and add your site to this list!

## Usage

### Installation

- `ember install ember-cli-prerender`
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
- `ember generate sitemap`
- Add the following scripts to your `package.json`:
```json
{
  "scripts": {
    "build": "ember build",
    "postbuild": "ember prerender"
  }
}
```
- If you're using [dynamic segments](https://guides.emberjs.com/v2.13.0/routing/defining-your-routes/#toc_dynamic-segments), edit `utils/dynamic-segment-resolver.js` so that it returns the possible values for each dynamic segment ([Example](tests/dummy/app/utils/dynamic-segment-resolver.js)).

### Running

`npm run build`

This will build your app, prerender it and generate sitemap files along with prerendered HTML files in your `/dist` directory.

### Optional settings for advanced usage

You most likely will not need to adjust any of the following settings.

Setting | Type | Default | Description
--- | --- | --- | ---
keep-fastboot | Boolean | false | If set to false, it will remove the `/dist/fastboot` folder, because you do not need it in production.
input-dir | String | dist | Change it if your app does not get built in the default `/dist` directory.
output-dir | String | dist | By default, the prerendered files are saved in your `/dist` folder. This option allows you to change that.
empty-output-dir | Boolean | false | If true, the prerendering script will clear the output directory before creating the prerendered files. Should be used in conjunction with `output-dir`.
max-simultaneous-url-fetches | Number | 6 | We throttle requests to our local Fastboot server so it doesn't get overloaded with too many async requests.
root-url | String |  | You can leave it blank if your app is located at the root-level on your domain. If your app is in a subfolder, this setting should match the `rootUrl` setting in your `ember-cli-build.js`.
sitemap-file-name | String | sitemap | The file name for the txt and xml sitemaps.

Example:

```shell
ember prerender --output-dir dist-static --empty-output-dir 1 --max-simultaneous-url-fetches 12
```

## Contribution

As with every other open-source project, contributions are appreciated!  
Need ideas? Take a look at the list under 'Upcoming features'.

### Installation

1. `git clone` this repository
1. `npm install`

### Running

1. `npm start`
1. Visit the app at [http://localhost:4200](http://localhost:4200).

### Testing

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `npm run build`

### Running the prerendered version

* `npm run static-server`

## License

MIT
