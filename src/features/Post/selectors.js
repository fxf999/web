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

export const selectPostByPermlink = (author, permlink) => createSelector(
  selectPosts(),
  posts => {

    for (const day in posts) {
      for (const rank in posts[day]) {
        const post = posts[day][rank];
        if (post.author === author && post.permlink === permlink) {
          return { day: day, rank: rank, post: post };
        }
      }
    }

    return null;
  },
);

export const selectCurrentComments = () => createSelector(
  [selectCurrentPost(), selectCommentsDomain()],
  (currentPost, commentsDomain) => {
    return currentPost ? commentsDomain.commentsFromPost[`${currentPost.author}/${currentPost.permlink}`] : {};
  }
);
