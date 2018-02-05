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
