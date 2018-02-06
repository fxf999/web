import numeral from 'numeral';

export const getPostKey = (post, prefix = '@') => `${prefix}${post.author}/${post.permlink}`;

export const getPostByKey = (posts, author, permlink) => {
  for (const day in posts) {
    for (const rank in posts[day]) {
      const post = posts[day][rank];
      if (post.author === author && post.permlink === permlink) {
        return { day: day, rank: rank, post: post };
      }
    }
  }

  return { day: null, rank: null, post: null };
}

export const getCommentsCount = (post, commentsList, commentsChild) => {
  let count = commentsList.length;
  for (const id of commentsList) {
    console.log(id);
    if (commentsChild[id]) {
      count += commentsChild[id].length;
    }
  }

  return numeral(count).format('0,0');
}