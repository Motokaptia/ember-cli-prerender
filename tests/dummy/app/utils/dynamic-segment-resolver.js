import fetch from 'ember-network/fetch';

// eslint-disable-next-line no-unused-vars
export default function dynamicSegmentResolver(dynamicSegmentKey, allSegments, otherDynamicSegments) {

  /**
   * Uncomment the line below and open localhost:4200/sitemap.txt on your browser.
   * You will see what parameters are passed to this function in the console.
   */
  // console.log('dynamicSegmentResolver:', dynamicSegmentKey, allSegments, otherDynamicSegments);

  if (dynamicSegmentKey === 'user_id') {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(users => users.map(user => user.id));
  } else if (dynamicSegmentKey === 'photo_id' && otherDynamicSegments.user_id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${otherDynamicSegments.user_id}/photos`)
      .then(response => response.json())
      .then(photos => photos.slice(0, 8))
      .then(photos => photos.map(photo => photo.id));
  }

  return [];
}
