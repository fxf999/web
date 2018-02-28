import { put, takeEvery } from 'redux-saga/effects';
import steem from 'steem';
import update from 'immutability-helper';

/*--------- CONSTANTS ---------*/
const GET_FOLLOWINGS_BEGIN = 'GET_FOLLOWINGS_BEGIN';
const GET_FOLLOWINGS_SUCCESS = 'GET_FOLLOWINGS_SUCCESS';
const GET_FOLLOWINGS_FAILURE = 'GET_FOLLOWINGS_FAILURE';

/*--------- ACTIONS ---------*/
export function getFollowingsBegin(accountName, query = {}, limit = 0) {
  return { type: GET_FOLLOWINGS_BEGIN, accountName, query, limit };
}

export function getFollowingsSuccess(accountName, followings) {
  return { type: GET_FOLLOWINGS_SUCCESS, accountName, followings };
}

export function getFollowingsFailure(message) {
  return { type: GET_FOLLOWINGS_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function getFollowingsReducer(state, action) {
  switch (action.type) {
    case GET_FOLLOWINGS_BEGIN: {
      const { accountName } = action;
      return update(state, {
        followings: {
          [accountName]: {$auto: {
            list: {$autoArray: {}},
            isLoading: {$set: true},
          }},
        },
      });
    }
    case GET_FOLLOWINGS_SUCCESS: {
      const { accountName, followings } = action;
      return update(state, {
        followings: {
          [accountName]: {
            list: {$apply: list => {
              // FILTER RESULTS FOR ACCOUNTS ALREADY IN FOLLOWINGS
              const filteredFollowings = followings.filter(following => !list.find(followingState => followingState.following === following.following));
              return [
                ...list,
                ...filteredFollowings,
              ]
            }},
            isLoading: {$set: false},
          },
        },
      });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getFollowings(props) {
  const { accountName, query } = props;
  let { limit } = props;
  let endList = false;

  try {
    let startFollowing = '';

    // limit = 0, get all followings
    if (limit === 0) {
      limit = 90;
    }
    if (query.addMore) {
      startFollowing = query.lastFollowing;
    }

    let followings = yield steem.api.getFollowingAsync(accountName, startFollowing, 'blog', limit);
    if (followings.length < limit) {
      endList = true;
    }

    if (query.addMore) {
      followings = followings.slice(1);
    }

    yield put(getFollowingsSuccess(accountName, followings));

    if (limit === 90 && endList === false) {
      yield put(getFollowingsBegin(accountName, { addMore: true, lastFollowing: followings[followings.length -  1].following }, 0));
    }
  } catch(e) {
    yield put(getFollowingsFailure(e.message));
  }
}

export default function* getFollowingsManager() {
  yield takeEvery(GET_FOLLOWINGS_BEGIN, getFollowings);
}
