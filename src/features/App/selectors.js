import { createSelector } from 'reselect';

export const selectAppConfig = () => state => state.app;

/**
 * Other specific selectors
 */
export const selectAppProps = () => createSelector(
  selectAppConfig(),
  state => state.props,
);

export const selectAppRewardFund = () => createSelector(
  selectAppConfig(),
  state => state.rewardFund,
);

export const selectAppRate = () => createSelector(
  selectAppConfig(),
  state => state.rate,
);

export const selectCurrentCategory = () => createSelector(
  selectAppConfig(),
  posts => posts.currentCategory,
);

export const selectCurrentTag = () => createSelector(
  selectAppConfig(),
  posts => posts.currentTag,
);
