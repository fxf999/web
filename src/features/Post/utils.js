import numeral from 'numeral';

export const getPostKey = (post) => `${post.author}/${post.permlink}`;
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