import { put, select, takeEvery } from 'redux-saga/effects';
import steem from 'steem';
import { selectMe } from 'features/User/selectors';
import steemConnectAPI from 'utils/steemConnectAPI';
import { postRefreshBegin } from 'features/Post/actions/refreshPost';

/*--------- CONSTANTS ---------*/
const VOTE_BEGIN = 'VOTE_BEGIN';
export const VOTE_OPTIMISTIC = 'VOTE_OPTIMISTIC';
export const VOTE_FAILURE = 'VOTE_FAILURE';
export const UPDATE_PAYOUT = 'UPDATE_PAYOUT';

/*--------- ACTIONS ---------*/
export function voteBegin(content, weight, contentType) {
  return { type: VOTE_BEGIN, content, weight, contentType };
}

function voteOptimistic(content, accountName, weight, contentType) {
  return { type: VOTE_OPTIMISTIC, content, accountName, weight, contentType };
}

export function voteFailure(content, accountName, contentType, message) {
  return { type: VOTE_FAILURE, content, accountName, contentType, message };
}

export function updatePayout(content, contentType) {
  return { type: UPDATE_PAYOUT, content, contentType };
}

/*--------- SAGAS ---------*/
function* vote({ content, weight, contentType }) {
  const accountName = yield select(selectMe());
  yield put(voteOptimistic(content, accountName, weight, contentType));

  try {
    yield steemConnectAPI.vote(accountName, content.author, content.permlink, weight);

    // UPDATE PAYOUT
    const { author, permlink } = content;
    const updatedContent = yield steem.api.getContentAsync(author, permlink);

    if (contentType === 'post') {
      yield put(postRefreshBegin(content));
    }

    yield put(updatePayout(updatedContent, contentType));

  } catch(e) {
    yield put(voteFailure(content, accountName, contentType, e.message));
  }
}

export default function* voteManager() {
  yield takeEvery(VOTE_BEGIN, vote);
}


// FIXME: TODO:
// - why actions twice?
