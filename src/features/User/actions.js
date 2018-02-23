import combine from 'utils/combine';
/*
 * EXPORTING REDUCERS and SAGAS
 */
import getMe, { getMeReducer } from './actions/getMe';
import getAccounts, { getAccountsReducer } from './actions/getAccounts';
import getFollowerCount, { getFollowerCountReducer } from './actions/getFollowerCount';
import getFollowings, { getFollowingsReducer } from './actions/getFollowings';
import setCurrentUser, { setCurrentUserReducer } from './actions/setCurrentUser';
import logout, { logoutReducer } from './actions/logout';
import follow, { followReducer } from './actions/follow';
import unfollow, { unfollowReducer } from './actions/unfollow';
import usersReducer from './reducer';

export const initialState = {
  me: '',
  accounts: {},
  followers: {},
  followings: {},
};

export const reducer = (state = initialState, action) => combine(
  [
    getMeReducer,
    getAccountsReducer,
    getFollowerCountReducer,
    getFollowingsReducer,
    logoutReducer,
    setCurrentUserReducer,
    followReducer,
    unfollowReducer,
    usersReducer,
  ],
  state,
  action,
);

// All sagas to be loaded
export default [
  getMe,
  getAccounts,
  getFollowerCount,
  getFollowings,
  logout,
  setCurrentUser,
  follow,
  unfollow,
];
