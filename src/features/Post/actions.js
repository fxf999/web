import combine from 'utils/combine';
/*
 * EXPORTING REDUCERS and SAGAS
 */
import getPosts, { getPostsReducer } from './actions/getPosts';
import getPost, { getPostReducer } from './actions/getPost';
import publishContent, { publishContentReducer } from './actions/publishContent';
import { updateDraftReducer } from './actions/updateDraft';
import resteem, { resteemReducer } from './actions/resteem';
import postReducer from 'features/Post/reducer';
import vote from 'features/Vote/actions/vote';

export const initialState = {
  draft: {
    url: '#',
    title: 'Title',
    tagline: 'Short Description',
    tags: [],
    images: [],
    author: null,
    beneficiaries: [],
  },
  posts: {},
  dailyRanking: {},
  isPublishing: false,
  currentPostKey: null,
};

export const reducer = (state = initialState, action) => combine(
  [
    updateDraftReducer,
    getPostsReducer,
    getPostReducer,
    publishContentReducer,
    postReducer,
    resteemReducer,
  ],
  state,
  action,
);

// All sagas to be loaded
export default [
  getPosts,
  getPost,
  publishContent,
  resteem,
  vote,
];
