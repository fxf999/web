// export const getPostDayBucket = post => Math.ceil((Date.now() - Date.parse(post.created_at)) / 86400000);

export const getPostKey = post => `@${post.username}/${post.permlink}`;
