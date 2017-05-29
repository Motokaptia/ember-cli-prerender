import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | sitemap xml');

test('visiting /sitemap.xml', function(assert) {
  visit('/sitemap.xml');

  andThen(() => {
    const urlset = find('urlset');
    assert.equal(urlset.attr('xmlns'), 'http://www.sitemaps.org/schemas/sitemap/0.9');

    const urls = find('url');
    assert.equal(urls.first().find('loc').html().trim(), 'https://mydummyapp.com/user/1/photos');
    assert.equal(urls.last().find('loc').html().trim(), 'https://mydummyapp.com/');
    assert.equal(urls.last().find('lastmod').html().trim(), '2017-01-01');
    assert.equal(urls.last().find('changefreq').html().trim(), 'monthly');
    assert.equal(urls.last().find('priority').html().trim(), '0.8');
  });
});
