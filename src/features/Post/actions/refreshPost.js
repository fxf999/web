import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import { getPostKey } from '../utils';
import api from 'utils/api';
import { calculateContentPayout } from 'utils/helpers/steemitHelpers';

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
      const { post } = action;
      let children = post.children;
      if (action.increaseCounter) {
        children++;
      }

      return update(state, {
        posts: { [getPostKey(post)]: {
          payout_value: { $set: calculateContentPayout(post) },
          active_votes: { $set: post.active_votes },
          children: { $set: children },
          isUpdating: { $set: false },
        }},
      });
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
