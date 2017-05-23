# ember-cli-prerender

An Ember CLI addon for prerendering Ember.js apps. 

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
- **[Skip this if you don't have any [dynamic segments](https://guides.emberjs.com/v2.13.0/routing/defining-your-routes/#toc_dynamic-segments) in your routes]** We need a utility function that resolves possible dynamic segment values.
```
ember generate util dynamicSegmentResolver
```
- We need a sitemap to tell the addon what URLs it needs to prerender. ember-cli-prerender has a handy sitemap service you can use to generate a sitemap:
    - `ember generate route sitemap-txt`
    - Edit *app/router.js* and change `this.route('sitemap-txt');` to `this.route('sitemap-txt', { path: 'sitemap.txt' });`
    - Edit *app/templates/sitemap-txt.hbs*: `{{sitemap-txt model=model}}`
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
- If you'd like to generate an [XML sitemap](https://support.google.com/webmasters/answer/183668?hl=en) as well (to submit to Google Search Console, for example), do the following:
    - `ember generate route sitemap-xml`
    - Edit *app/router.js* and change `this.route('sitemap-xml');` to `this.route('sitemap-xml', { path: 'sitemap.xml' });`
    - Edit *app/templates/sitemap-xml.hbs*: `{{sitemap-xml model=model}}`
    - Copy everything from *app/routes/sitemap-txt.js* to *app/routes/sitemap-xml.js*

### Running

After installing and configuring the addon, you can prerender the built application in your `/dist` folder using the `ember prerender` command. 

#### Optional settings

- **keep-fastboot [Boolean, default: false]**: If set to false, it will remove the `/dist/fastboot` folder, because you do not need it in production.
- **input-dir [String, default: 'dist']**: Change it if your app does not get built in the default `/dist` directory.
- **output-dir [String, default: 'dist']**: By default, the prerendered files are saved in your `/dist` folder. This option allows you to change that.
- **empty-output-dir [Boolean, default: false]**: If true, the prerendering script will clear the output directory before creating the prerendered files. Should be used in conjunction with `output-dir`.
- **max-simultaneous-url-fetches [Number, default: 6]**: We throttle requests to our local Fastboot server so it doesn't get overloaded with too many async requests.
- **root-url [String, default: '']**: You can leave it blank if your app is located at the root-level on your domain. If your app is in a subfolder, this setting should match the `rootUrl` setting in your `ember-cli-build.js`.

Example:

```js
ember prerender --output-dir dist-static --empty-output-dir 1 --max-simultaneous-url-fetches 12
```

#### Prerender automatically after every build

If you'd like to prerender your app automatically after every build, you can add the following scripts to your `package.json` and use one npm command to build and prerender your app: `npm run build`

```js
{
  ...
  "scripts": {
    "build": "ember build",
    "postbuild": "ember prerender",
    ...
  },
  ...
}
```

## Contribution

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

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

MIT
