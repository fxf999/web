import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import api from 'utils/api';

/*--------- CONSTANTS ---------*/
const GET_POSTS_BEGIN = 'GET_POSTS_BEGIN';
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS';
const GET_POSTS_FAILURE = 'GET_POSTS_FAILURE';

/*--------- ACTIONS ---------*/
export function getPostsBegin(daysAgo) {
  return { type: GET_POSTS_BEGIN, daysAgo };
}

export function getPostsSuccess(daysAgo, posts) {
  return { type: GET_POSTS_SUCCESS, daysAgo, posts };
}

export function getPostsFailure(message) {
  return { type: GET_POSTS_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function getPostsReducer(state, action) {
  switch (action.type) {
    case GET_POSTS_SUCCESS: {
      const { daysAgo, posts } = action;

      return update(state, {
        posts: { [daysAgo]: { $set: posts } },
      });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getPosts({ daysAgo }) {
  try {
    const posts = yield api.get('/posts.json', { days_ago: daysAgo });

    yield put(getPostsSuccess(daysAgo, posts));
  } catch(e) {
    yield put(getPostsFailure(e.message));
  }
}

export default function* getPostsManager() {
  yield takeEvery(GET_POSTS_BEGIN, getPosts);
}
