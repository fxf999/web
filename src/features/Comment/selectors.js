import { createSelector } from 'reselect';

export const selectCommentsDomain = () => state => state.comments;

/**
 * Other specific selectors
 */
export const selectCommentsData = () => createSelector(
  selectCommentsDomain(),
  state => state.commentsData || {},
);

export const selectCommentsChild = () => createSelector(
  selectCommentsDomain(),
  state => state.commentsChild || {},
);

export const selectCommentsIsLoading = () => createSelector(
  selectCommentsDomain(),
  state => state.isLoading,
);

export const selectCommentById = id => createSelector(
  selectCommentsData(),
  commentsData => commentsData[id] || {},
);

export const selectCommentsFromPost = id => createSelector(
  selectCommentsDomain(),
  state => state.commentsFromPost[id] || [],
);

export const selectIsCommentPublishing = () => createSelector(
  selectCommentsDomain(),
  state => state.isPublishing,
);

export const selectHasCommentSucceeded = () => createSelector(
  selectCommentsDomain(),
  state => state.hasSucceeded,
);

