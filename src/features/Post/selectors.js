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

export const selectCurrentComments = () => createSelector(
  [selectCurrentPost(), selectCommentsDomain()],
  (currentPost, commentsDomain) => {
    return currentPost ? commentsDomain.commentsFromPost[`${currentPost.username}/${currentPost.permlink}`] : {};
  }
);
