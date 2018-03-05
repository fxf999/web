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
import postRefresh, { postRefreshReducer } from './actions/refreshPost';

export const initialState = {
  draft: {
    url: '#',
    title: 'Title',
    tagline: 'Short Description',
    permlink: null,
    description: 'Long Description',
    tags: [],
    images: [],
    author: null,
    active_votes: [],
    payout_value: 0,
    children: 0,
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
    postRefreshReducer,
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
  postRefresh,
];
