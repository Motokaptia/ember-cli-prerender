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

1. `ember install ember-cli-prerender`
1. Configure the addon in your `ember-cli-build.js`:
```js
  var app = new EmberApp(defaults, {
    'ember-cli-prerender': {
      // TODO: Add list of config params along with descriptions and examples
    }
  });
```

### Running

Once you install and configure the addon, it will prerender your app and generate html files in your `dist` folder when you run `ember build`.

## Contribution

### Installation

1. `git clone` this repository
1. `npm install`
1. `bower install`

### Running

1. `npm start`
1. Visit the app at http://localhost:4200.

### Testing

* `npm test`

### Building

* `ember build`

## License

MIT
