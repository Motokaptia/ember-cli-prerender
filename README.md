# ember-cli-prerender

An Ember CLI addon for prerendering Ember.js apps. 

# WORK IN PROGRESS

This addon will be ready to be used in a few days. We haven't pushed the whole codebase yet.

## The problem

Applications that heavily use Javascript to render pages, like apps made with Ember.js or any other Javascript framework,

- suffer from long initial load and render times, specially on mobile devices with slower networks, because pages don't render until Javascript assets are loaded. This affects the **user experience** and consequently the **search engine ranking**.
- may not be crawled properly by search engines, even though search engine crawlers can now render Javascript to some extent.

## The solution

When a Javascript application is prerendered, the intial render on the client-side can happen before the Javascript files are loaded and run. Faster initial render improves the user experience and the search engine ranking.

### Why not SSR? (server-side rendering)

These benefits can also be achieved with server-side rendering. [FastBoot](https://ember-fastboot.com/) can be used to render Ember.js apps on the server-side, but it has these drawbacks:

- FastBoot is not production-ready yet.
- It would require running a Node.js app on the server. Besides limiting your hosting options, this introduces complexities such as caching and error logging.

This addon uses FastBoot when prerendering your app, but it uses it on buildtime instead of on runtime.

### Is this production-ready?

We are using this addon at [MicroMech](https://micromech.net) in production.

Are you using this addon in production as well? Please let us know!

## Usage

### Installation

1. `ember install ember-cli-prerender`
1. Configure the addon in your `ember-cli-build.js`:
```js
  var app = new EmberApp(defaults, {
    'ember-cli-prerender': {
      // TODO: Add list of config params along with descriptions and examples
    }
  });
```
1. **[Skip this if you don't have any [dynamic segments](https://guides.emberjs.com/v2.13.0/routing/defining-your-routes/#toc_dynamic-segments) in your routes]** We need a utility function that resolves possible dynamic segment values. `ember generate util dynamicSegmentResolver`
1. We need a sitemap so the addon know what URLs it needs to prerender. There is a sitemap service you can use to easily generate a sitemap:
    - `ember generate route sitemap-txt`
    - Edit *app/router.js* and change `this.route('sitemap-txt');` to `this.route('sitemap-txt', { path: 'sitemap.txt' });`
    - Edit *app/routes/sitemap-txt.js*:
    ```js
import Ember from 'ember';
import dynamicSegmentResolver from '../utils/dynamic-segment-resolver'; // Remove if you don't have dynamic segments

export default Ember.Route.extend({
  sitemap: Ember.inject.service(),

  model() {
    const sitemap = this.get('sitemap');
    sitemap.setDynamicSegmentResolver(dynamicSegmentResolver); // Remove if you don't have dynamic segments
    return sitemap.getModel();
  },
});
```
    - Edit *app/templates/sitemap-txt.hbs*: `{{sitemap-txt model=model}}`
1. If you'd like to generate an XML sitemap as well (to submit to Google Search Console, for example), do the following:
    - `ember generate route sitemap-xml`
    - Edit *app/router.js* and change `this.route('sitemap-xml');` to `this.route('sitemap-xml', { path: 'sitemap.xml' });`
    - Copy everything from *app/routes/sitemap-txt.js* to *app/routes/sitemap-xml.js*
    - Edit *app/templates/sitemap-xml.hbs*: `{{sitemap-xml model=model}}`

### Running

Once you install and configure the addon, it will prerender your app and generate html files in your `dist` folder when you run `ember build`.

## Contribution

### Installation

1. `git clone` this repository
1. `npm install`
1. `bower install`

### Running

1. `npm start`
1. Visit the app at [http://localhost:4200](http://localhost:4200).

### Testing

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

MIT
