import { put, select, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import isEmpty from 'lodash/isEmpty';

import api from 'utils/api';
import { selectPostByPermlink } from '../selectors';

/*--------- CONSTANTS ---------*/
const GET_POST_BEGIN = 'GET_POST_BEGIN';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_FAILURE = 'GET_POST_FAILURE';
const SET_CURRENT_POST = 'SET_CURRENT_POST';

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

export function setCurrentPost(post) {
  return { type: SET_CURRENT_POST, post };
}

/*--------- REDUCER ---------*/
export function getPostReducer(state, action) {
  switch (action.type) {
    case GET_POST_SUCCESS:
    case SET_CURRENT_POST:
      return update(state, {
        currentPost: { $set: action.post }
      });
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getPost({ author, permlink }) {
  try {
    // Try retrieving from state first
    let { post } = yield select(selectPostByPermlink(author, permlink));
    if (isEmpty(post)) {
      // Retrieve from API when user accessed to a product page directly
      post = yield api.get(`/posts/@${author}/${permlink}.json`);
    }

    yield put(getPostSuccess(post));
  } catch(e) {
    yield put(getPostFailure(e.message));
  }
}

export default function* getPostManager() {
  yield takeEvery(GET_POST_BEGIN, getPost);
}
