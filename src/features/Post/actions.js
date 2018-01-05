import combine from 'utils/combine';
/*
 * EXPORTING REDUCERS and SAGAS
 */
import getPostsBy, { getPostsByReducer } from './actions/getPostsBy';
import getOnePost, { getOnePostReducer } from './actions/getOnePost';
import publishContent, { publishContentReducer } from './actions/publishContent';
import { updateDraftReducer } from './actions/updateDraft';
import resteem, { resteemReducer } from './actions/resteem';
import postsReducer from './reducer';

export const initialState = {
  draft: {
    url: '#',
    title: 'Title',
    tagline: 'Short Description',
    tags: [],
    images: [],
    username: null,
    beneficiaries: [],
  },
  posts: {},
  currentPostId: undefined,
  categories: {
    created: {},
    feed: {},
    blog: {},
    trending: {},
    hot: {},
  },
  isPublishing: false,
};

export const reducer = (state = initialState, action) => combine(
  [
    updateDraftReducer,
    getPostsByReducer,
    getOnePostReducer,
    publishContentReducer,
    postsReducer,
    resteemReducer,
  ],
  state,
  action,
);

// All sagas to be loaded
export default [
  getPostsBy,
  getOnePost,
  publishContent,
  resteem,
];
