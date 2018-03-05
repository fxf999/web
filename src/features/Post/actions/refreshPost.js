import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import { getPostKey } from '../utils';
import api from 'utils/api';

/*--------- CONSTANTS ---------*/
const POST_REFRESH_BEGIN = 'POST_REFRESH_BEGIN';
const POST_REFRESH_SUCCESS = 'POST_REFRESH_SUCCESS';
const POST_REFRESH_FAILURE = 'POST_REFRESH_FAILURE';

/*--------- ACTIONS ---------*/
export function postRefreshBegin(post, increaseCounter = false) {
  return { type: POST_REFRESH_BEGIN, post, increaseCounter };
}

export function postRefreshSuccess(post, increaseCounter) {
  return { type: POST_REFRESH_SUCCESS, post, increaseCounter };
}

export function postRefreshFailure(message) {
  return { type: POST_REFRESH_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function postRefreshReducer(state, action) {
  switch (action.type) {
    case POST_REFRESH_SUCCESS: {
      if (action.increaseCounter) {
        return update(state, {
          posts: {
            [getPostKey(action.post)]: { $merge: { ...action.post, children: action.post.children + 1 } }
          },
        });
      } else {
        return update(state, {
          posts: {
            [getPostKey(action.post)]: { $merge: action.post }
          },
        });
      }
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* postRefresh({ post, increaseCounter }) {
  try {
    yield api.refreshPost(post);
    yield put(postRefreshSuccess(post, increaseCounter));
  } catch (e) {
    yield put(postRefreshFailure(e.message));
  }
}

export default function* postRefreshManager() {
  yield takeEvery(POST_REFRESH_BEGIN, postRefresh);
}
