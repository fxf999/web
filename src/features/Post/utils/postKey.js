export default function getPostKey(post) {
  return `@${post.username}/${post.permlink}`;
}
