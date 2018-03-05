import { put, select, takeEvery } from 'redux-saga/effects';
import steem from 'steem';
import update from 'immutability-helper';
import { getRootCommentsList, mapCommentsBasedOnId } from '../utils/comments';
import { sortCommentsFromSteem } from 'utils/helpers/stateHelpers';
import { selectPosts } from 'features/Post/selectors';
import { getPostKey, hasUpdated } from 'features/Post/utils';
import { getPostSuccess } from 'features/Post/actions/getPost';
import { calculateContentPayout } from 'utils/helpers/steemitHelpers';
import { postRefreshBegin } from 'features/Post/actions/refreshPost';

/*--------- CONSTANTS ---------*/
const GET_COMMENTS_FROM_POST_BEGIN = 'GET_COMMENTS_FROM_POST_BEGIN';
export const GET_COMMENTS_FROM_POST_SUCCESS = 'GET_COMMENTS_FROM_POST_SUCCESS';
const GET_COMMENTS_FROM_POST_FAILURE = 'GET_COMMENTS_FROM_POST_FAILURE';

/*--------- ACTIONS ---------*/
export function getCommentsFromPostBegin(category, author, permlink) {
  return { type: GET_COMMENTS_FROM_POST_BEGIN, category, author, permlink };
}

export function getCommentsFromPostSuccess(postKey, state) {
  return { type: GET_COMMENTS_FROM_POST_SUCCESS, postKey, state };
}

export function getCommentsFromPostFailure(message) {
  return { type: GET_COMMENTS_FROM_POST_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function getCommentsFromPostReducer(state, action) {
  switch (action.type) {
    case GET_COMMENTS_FROM_POST_BEGIN: {
      return update(state, {
        isLoading: {$set: true},
      });
    }
    case GET_COMMENTS_FROM_POST_SUCCESS: {
      return update(state, {
        isLoading: {$set: false},
        commentsFromPost: {
          [action.postKey]: {$auto: {
            // SORTS COMMENTS HERE TO AVOID JUMPS WHEN VOTING
            list: {$set: sortCommentsFromSteem(getRootCommentsList(action.state), mapCommentsBasedOnId(action.state.content), 'trending')},
          }},
        }
      });
    }
    case GET_COMMENTS_FROM_POST_FAILURE: {
      return update(state, {
        isLoading: {$set: false},
      });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getCommentsFromPost({ category, author, permlink }) {
  try {
    const state = yield steem.api.getStateAsync(`/${category}/@${author}/${permlink}`);

    // Update posts dictionary with the fresh blockchain data
    const posts = yield select(selectPosts());
    const commentsData = mapCommentsBasedOnId(state.content);

    for (const content of Object.values(commentsData)) {
      const postKey = getPostKey(content);
      content.payout_value = calculateContentPayout(content); // Sync with local format

      if (posts && posts[postKey] && hasUpdated(posts[postKey], content)) {
        // Update posts cache with the fresh blockchain data
        yield put(postRefreshBegin(content));

        // Update local posts cache
        yield put(getPostSuccess(content));
      }
    }

    yield put(getCommentsFromPostSuccess(`${author}/${permlink}`, state));
  } catch(e) {
    yield put(getCommentsFromPostFailure(e.message));
  }
}

export default function* getCommentsFromPostManager() {
  yield takeEvery(GET_COMMENTS_FROM_POST_BEGIN, getCommentsFromPost);
}
