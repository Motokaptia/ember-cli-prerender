import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sitemap-txt', 'Integration | Component | sitemap txt', {
  integration: true
});

test('it wraps the output with <pre id="sitemap-txt"> and </pre>', function(assert) {

  this.render(hbs`{{sitemap-txt model=model}}`);

  const output = this.$().find('div').html().trim();

  assert.equal(output.indexOf('<pre id="sitemap-txt">'), 0);
  assert.equal(output.indexOf('</pre>'), output.length - '</pre>'.length);
});

test('it outputs each entry url on a separate line', function(assert) {

  const sampleModel = [
    { loc: 'mySampleUrl1' },
    { loc: 'mySampleUrl2' },
  ];

  this.set('model', sampleModel);

  this.render(hbs`{{sitemap-txt model=model}}`);

  const printedUrls = this.$().find('pre').html().trim().split('\n');

  assert.equal(printedUrls.length, sampleModel.length);
  assert.equal(printedUrls[0], sampleModel[0].loc);
  assert.equal(printedUrls[1], sampleModel[1].loc);
});
