import { createSelector } from 'reselect';

const selectUserDomain = () => state => state.user;

export const selectIsLoading = () => createSelector(
  selectUserDomain(),
  state => state.isLoading,
);

export const selectMe = () => createSelector(
  selectUserDomain(),
  state => state.me,
);

// ACCOUNTS
export const selectAccounts = () => createSelector(
  selectUserDomain(),
  state => state.accounts || {},
);

export const selectAccount = accountName => createSelector(
  selectAccounts(),
  accounts => { return accounts[accountName] || {}; },
);

export const selectCurrentUser = () => createSelector(
  selectUserDomain(),
  state => state.currentUser,
);

export const selectCurrentAccount = () => createSelector(
  [selectCurrentUser(), selectAccounts()],
  (currentUser, accounts) => accounts[currentUser] || {},
);

export const selectMyAccount = () => createSelector(
  [selectMe(), selectAccounts()],
  (me, accounts) => accounts[me] || {},
);

export const selectMyFollowingsList = () => createSelector(
  [selectMe(), selectFollowings()],
  (me, state) => (state[me] && state[me].list) || [],
);

export const selectMyFollowingsLoadStatus = () => createSelector(
  [selectMe(), selectFollowings()],
  (me, state) => (state[me] && state[me].loadStatus) || {},
);

export const selectIsConnected = () => createSelector(
  selectMe(),
  me => !!me,
);

// FOLLOWERS
export const selectFollowers = () => createSelector(
  selectUserDomain(),
  state => state.followers,
);

export const selectFollowersFromUser = accountName => createSelector(
  selectFollowers(),
  state => state[accountName] || {},
);

export const selectFollowersCount = accountName => createSelector(
  selectFollowersFromUser(accountName),
  state => state.count,
);

export const selectFollowersList = accountName => createSelector(
  selectFollowersFromUser(accountName),
  state =>  state.list,
);

export const selectLastFollower = accountName => createSelector(
  selectFollowersList(accountName),
  state => state && state[state.length - 1],
);

export const selectFollowersAccounts = accountName => createSelector(
  [selectAccounts(), selectFollowersList(accountName)],
  (accounts, followers) => {
    if (!followers) {
      return [];
    }
    const followersAccounts = [];
    followers.forEach(follow => {
      if (accounts[follow.follower]) {
        followersAccounts.push(accounts[follow.follower]);
      }
    });
    return followersAccounts;
  },
);

// FOLLOWING
export const selectFollowings = () => createSelector(
  selectUserDomain(),
  state => state.followings,
);

export const selectFollowingsFromUser = accountName => createSelector(
  selectFollowings(),
  state => state[accountName] || {},
);

export const selectFollowingsCount = accountName => createSelector(
  selectFollowingsFromUser(accountName),
  state => state.count,
);

export const selectFollowingsList = accountName => createSelector(
  selectFollowingsFromUser(accountName),
  state =>  state.list,
);

export const selectLastFollowing = accountName => createSelector(
  selectFollowingsList(accountName),
  state => state && state[state.length - 1],
);
