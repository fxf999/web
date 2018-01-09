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

export const selectIsLoading = () => createSelector(
  selectPostDomain(),
  state => state.isLoading,
);

export const selectHasMore = () => createSelector(
  selectPostDomain(),
  state => state.hasMore,
);




export const selectCurrentPostId = () => createSelector(
  selectPostDomain(),
  posts => posts.currentPostId,
);

export const selectPostByPermlink = (author, permlink) => createSelector(
  selectPosts(),
  posts => posts[`${author}/${permlink}`] || {},
);

export const selectCurrentPost = () => createSelector(
  [selectPosts(), selectCurrentPostId()],
  (posts, id) => posts[id],
);

export const selectCurrentComments = () => createSelector(
  [selectCurrentPostId(), selectCommentsDomain()],
  (currentPostId, commentsDomain) => {
    return currentPostId ? commentsDomain.commentsFromPost[currentPostId] : {};
  }
);

/*export const selectPostVideosFeed = () => createSelector(
  selectPostFeed(),
  state => state.filter(post => post.json_metadata && !isEmpty(post.json_metadata.links) && post.json_metadata.links.find(link => link.match(/youtube/))) || [],
);*/
