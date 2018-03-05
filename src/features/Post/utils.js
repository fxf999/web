import numeral from 'numeral';

export const getPostKey = (post) => `${post.author}/${post.permlink}`;
export const getPostPath = (post) => `/@${post.author}/${post.permlink}`;
export const generatePostKey = (author, permlink) => `${author}/${permlink}`;

export const getCommentsCount = (post, commentsList, commentsChild) => {
  let count = commentsList.length;
  for (const id of commentsList) {
    if (commentsChild[id]) {
      count += commentsChild[id].length;
    }
  }

  return numeral(count).format('0,0');
}

export const hasUpdated = (oldPost, newPost) =>
  oldPost.active_votes.length !== newPost.active_votes.length ||
  Math.abs(oldPost.payout_value - newPost.payout_value) > 0.00001 ||
  oldPost.children !== newPost.children;
