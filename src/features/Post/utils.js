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