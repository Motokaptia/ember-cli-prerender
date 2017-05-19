import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sitemap-txt', 'Integration | Component | sitemap txt', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sitemap-txt}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sitemap-txt}}
      template block text
    {{/sitemap-txt}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
