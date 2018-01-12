import { put, select, takeEvery } from 'redux-saga/effects';
import steem from 'steem';
import steemconnect from 'sc2-sdk';
import { selectMe } from 'features/User/selectors';

/*--------- CONSTANTS ---------*/
const VOTE_BEGIN = 'VOTE_BEGIN';
export const VOTE_OPTIMISTIC = 'VOTE_OPTIMISTIC';
export const VOTE_SUCCESS = 'VOTE_SUCCESS';
export const VOTE_FAILURE = 'VOTE_FAILURE';
export const UPDATE_PAYOUT = 'UPDATE_PAYOUT';

/*--------- ACTIONS ---------*/
export function voteBegin(post, weight, contentType, params = {}) {
  return { type: VOTE_BEGIN, post, weight, contentType, params };
}

function voteOptimistic(post, accountName, weight, params) {
  return { type: VOTE_OPTIMISTIC, post, accountName, weight, params };
}

export function voteSuccess(post, contentType) {
  return { type: VOTE_SUCCESS, post, contentType };
}

export function voteFailure(post, accountName, params, message) {
  return { type: VOTE_FAILURE, post, accountName, params, message };
}

export function updatePayout(post, contentType) {
  return { type: UPDATE_PAYOUT, post, contentType };
}

/*--------- SAGAS ---------*/
function* vote({ post, weight, contentType, params }) {
  const accountName = yield select(selectMe());
  yield put(voteOptimistic(post, accountName, weight, params));

  try {
    yield steemconnect.vote(accountName, post.author, post.permlink, weight);
    yield put(voteSuccess(post, contentType));

    // UPDATE PAYOUT
    const { author, permlink } = post;
    const updatedContent = yield steem.api.getContentAsync(author, permlink);
    yield put(updatePayout(updatedContent, contentType));

  } catch(e) {
    yield put(voteFailure(post, accountName, params, e.message));
  }
}

export default function* voteManager() {
  yield takeEvery(VOTE_BEGIN, vote);
}
