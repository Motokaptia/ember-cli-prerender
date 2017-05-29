import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sitemap-xml', 'Integration | Component | sitemap xml', {
  integration: true
});

test('it wraps the output with <pre id="sitemap-xml"> and </pre>', function(assert) {

  this.render(hbs`{{sitemap-xml model=model}}`);

  const output = this.$().find('div').html().trim();

  assert.equal(output.indexOf('<pre id="sitemap-xml">'), 0);
  assert.equal(output.indexOf('</pre>'), output.length - '</pre>'.length);
});

test('its output is wrapped with standard XML sitemap markup', function(assert) {

  this.render(hbs`{{sitemap-xml}}`);

  const urlset = this.$().find('pre').children('urlset');

  assert.equal(urlset.length, 1);
  assert.equal(urlset.attr('xmlns'), 'http://www.sitemaps.org/schemas/sitemap/0.9');
});

test('it outputs entries in a standard XML sitemap format', function(assert) {

  const sampleModel = [
    { loc: 'mySampleUrl1' },
    { loc: 'mySampleUrl2', lastmod: 'LASTMOD', changefreq: 'CHANGEFREQ', priority: 'PRIORITY' },
  ];

  this.set('model', sampleModel);

  this.render(hbs`{{sitemap-xml model=model}}`);

  const entries = this.$().find('url');

  assert.equal(entries.length, sampleModel.length);
  assert.equal(entries.eq(0).find('loc').text(), sampleModel[0].loc);
  assert.equal(entries.eq(1).find('loc').text(), sampleModel[1].loc);
  assert.equal(entries.eq(1).find('lastmod').text(), sampleModel[1].lastmod);
  assert.equal(entries.eq(1).find('changefreq').text(), sampleModel[1].changefreq);
  assert.equal(entries.eq(1).find('priority').text(), sampleModel[1].priority);
});
