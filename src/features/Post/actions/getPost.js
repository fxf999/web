import { put, select, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import isEmpty from 'lodash/isEmpty';
import api from 'utils/api';
import { selectPostByKey } from '../selectors';
import { getPostKey, generatePostKey } from '../utils';

/*--------- CONSTANTS ---------*/
const GET_POST_BEGIN = 'GET_POST_BEGIN';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_FAILURE = 'GET_POST_FAILURE';
const SET_CURRENT_POST_KEY = 'SET_CURRENT_POST_KEY';

/*--------- ACTIONS ---------*/
export function getPostBegin(author, permlink) {
  return { type: GET_POST_BEGIN, author, permlink };
}

export function getPostSuccess(post) {
  return { type: GET_POST_SUCCESS, post };
}

export function getPostFailure(message) {
  return { type: GET_POST_FAILURE, message };
}

export function setCurrentPostKey(key) {
  return { type: SET_CURRENT_POST_KEY, key };
}

/*--------- REDUCER ---------*/
export function getPostReducer(state, action) {
  switch (action.type) {
    case GET_POST_SUCCESS:
      const { post } = action;
      const key = getPostKey(post);

      if (state.posts[key]) {
        return update(state, {
          posts: { [key]: {
            active_votes: { $set: post.active_votes },
            payout_value: { $set: post.payout_value },
          }},
        });
      } else {
        return update(state, {
          posts: { [key]: { $set: post } },
        });
      }
    case SET_CURRENT_POST_KEY:
      return update(state, {
        currentPostKey: { $set: action.key },
      });
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getPost({ author, permlink }) {
  try {
    // Try retrieving from state first
    const key = generatePostKey(author, permlink);
    let post = yield select(selectPostByKey(key));
    if (isEmpty(post)) {
      // Retrieve from API when user accessed to a product page directly
      post = yield api.get(`/posts/@${key}.json`);
    }

    yield put(getPostSuccess(post));
    yield put(setCurrentPostKey(key)); // Set current page
  } catch(e) {
    yield put(getPostFailure(e.message));
  }
}

export default function* getPostManager() {
  yield takeEvery(GET_POST_BEGIN, getPost);
}
