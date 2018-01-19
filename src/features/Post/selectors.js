import { createSelector } from 'reselect';
import { selectCommentsDomain } from 'features/Comment/selectors';

const selectPostDomain = () => state => state.post;

export const selectDraft = () => createSelector(
  selectPostDomain(),
  state => state.draft,
);

export const selectIsPublishing = () => createSelector(
  selectPostDomain(),
  state => state.isPublishing,
);

export const selectPosts = () => createSelector(
  selectPostDomain(),
  state => state.posts,
);

export const selectCurrentPost = () => createSelector(
  selectPostDomain(),
  post => post.currentPost,
);

export const selectPostByPermlink = (username, permlink) => createSelector(
  selectPosts(),
  posts => {
    console.log(posts);

    for (const day in posts) {
      for (const i in posts[day]) {
        const post = posts[day][i];
        if (post.username === username && post.permlink === permlink) {
          return post;
        }
      }
    }

    return null;
  },
);

// export const selectCurrentPost = () => createSelector(
//   [selectPosts(), selectCurrentPostId()],
//   (posts, id) => {
//     console.log(posts);

//     if (isEmpty(posts)) {
//       return null;
//     }

//     for (const [day, dailyPosts] of posts) {
//       for (const post of dailyPosts) {
//         if (post.id === id) {
//           return post;
//         }
//       }
//     }
//     return null;
//   },
// );

export const selectCurrentComments = () => createSelector(
  [selectCurrentPost(), selectCommentsDomain()],
  (currentPost, commentsDomain) => {
    return null;
    // return currentPostId ? commentsDomain.commentsFromPost[currentPostId] : {};
  }
);

/*export const selectPostVideosFeed = () => createSelector(
  selectPostFeed(),
  state => state.filter(post => post.json_metadata && !isEmpty(post.json_metadata.links) && post.json_metadata.links.find(link => link.match(/youtube/))) || [],
);*/
