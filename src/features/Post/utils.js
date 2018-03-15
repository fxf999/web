export const getPostKey = function(post) {
  return `${post.author}/${post.permlink}`;
}
export const getPostPath = function(post) {
  return `/@${post.author}/${post.permlink}`;
}
export const generatePostKey = function(author, permlink) {
  return `${author}/${permlink}`;
}
export const hasUpdated = function(oldPost, newPost) {
  return oldPost.active_votes.length !== newPost.active_votes.length ||
    Math.abs(oldPost.payout_value - newPost.payout_value) > 0.00001 ||
    oldPost.children !== newPost.children;
}
export const sanitizeText = function(text) {
  return text.trim().replace(/(\.)$/, '')
}

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    var hash =  '';
    if( uri.indexOf('#') !== -1 ){
        hash = uri.replace(/.*#/, '#');
        uri = uri.replace(/#.*/, '');
    }
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    return uri + separator + key + "=" + value + hash;
  }
}

export const addReferral = function(url) {
  url = updateQueryStringParameter(url, 'ref', 'steemhunt');

  if (url.match(/^https?:\/\/(www\.)?amazon\.com/)) {
    url = updateQueryStringParameter(url, 'tag', 'steemhunt-20');
  }

  return url;
}

export const getThumbnail = function(url, width, height) {
  if (/\.gif$/.test(url)) {
    return url;
  }

  return `https://steemitimages.com/${width}x${height}/${url}`;
}