import { createSelector } from 'reselect';
import { selectCommentsDomain } from 'features/Comment/selectors';
import { getPostByKey } from './utils';

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
  posts => getPostByKey(posts, author, permlink),
);

export const selectCurrentComments = () => createSelector(
  [selectCurrentPost(), selectCommentsDomain()],
  (currentPost, commentsDomain) => {
    return currentPost ? commentsDomain.commentsFromPost[`${currentPost.author}/${currentPost.permlink}`] : {};
  }
);
