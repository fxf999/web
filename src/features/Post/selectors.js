import { createSelector } from 'reselect';
import { selectCommentsDomain } from 'features/Comment/selectors';
import { generatePostKey } from './utils';

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

export const selectDailyRanking = () => createSelector(
  selectPostDomain(),
  state => state.dailyRanking,
);

export const selectCurrentPost = () => createSelector(
  selectPostDomain(),
  state => state.posts[state.currentPostKey],
);

export const selectPostByKey = (key) => createSelector(
  selectPosts(),
  posts => posts[key],
);

export const selectCurrentComments = () => createSelector(
  [selectCurrentPost(), selectCommentsDomain()],
  (currentPost, commentsDomain) => {
    return currentPost ? commentsDomain.commentsFromPost[generatePostKey(currentPost.author, currentPost.permlink)] : {};
  }
);
