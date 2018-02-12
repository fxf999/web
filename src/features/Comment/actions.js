import combine from 'utils/combine';
/*
 * EXPORTING REDUCERS and SAGAS
 */
import getCommentsFromPost, { getCommentsFromPostReducer } from './actions/getCommentsFromPost';
import reply, { replyReducer } from './actions/reply';
import commentsReducer from './reducer';

export const initialState = {
  commentsChild: {},
  commentsData: {},
  commentsFromPost: {},
  commentsFromUser: {},
  repliesToUser: {},
  isLoading: false,
  isPublishing: false,
  hasSucceeded: false,
};

export const reducer = (state = initialState, action) => combine(
  [
    getCommentsFromPostReducer,
    commentsReducer,
    replyReducer,
  ],
  state,
  action,
);

// All sagas to be loaded
export default [
  getCommentsFromPost,
  reply,
];
