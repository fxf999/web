import { put, select, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import isEmpty from 'lodash/isEmpty';

import api from 'utils/api';
import getPostKey from '../utils/postKey';
import { selectPostByPermlink } from '../selectors';

/*--------- CONSTANTS ---------*/
const GET_POST_BEGIN = 'GET_POST_BEGIN';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_FAILURE = 'GET_POST_FAILURE';
const SET_CURRENT_POST_ID = 'SET_CURRENT_POST_ID';
const GET_POST_ALREADY_IN_STATE = 'GET_POST_ALREADY_IN_STATE';

/*--------- ACTIONS ---------*/
export function getPostBegin(username, permlink) {
  return { type: GET_POST_BEGIN, username, permlink };
}

export function getPostSuccess(post) {
  return { type: GET_POST_SUCCESS, post };
}

export function getPostFailure(message) {
  return { type: GET_POST_FAILURE, message };
}

export function setCurrentPostId(id) {
  return { type: SET_CURRENT_POST_ID, id };
}

export function getPostAlreadyInState() {
  return { type: GET_POST_ALREADY_IN_STATE };
}

/*--------- REDUCER ---------*/
export function getPostReducer(state, action) {
  switch (action.type) {
    case GET_POST_SUCCESS: {
      const { post } = action;
      return update(state, {
        posts: {$merge: {
          [getPostKey(post)]: post,
        }},
      });
    }
    case SET_CURRENT_POST_ID: {
      return {
        ...state,
        currentPostId: action.id,
      }
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getPost({ username, permlink }) {
  try {
    const postByPermlink = yield select(selectPostByPermlink(username, permlink));
    yield put(setCurrentPostId(`${username}/${permlink}`));

    if (isEmpty(postByPermlink)) {
      const post = yield api.get(`/posts/@${username}/${permlink}.json`);
      yield put(getPostSuccess(post));
    } else {
      yield put(getPostAlreadyInState());
    }
  } catch(e) {
    yield put(getPostFailure(e.message));
  }
}

export default function* getPostManager() {
  yield takeEvery(GET_POST_BEGIN, getPost);
}
