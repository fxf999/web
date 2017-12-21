import combine from 'utils/combine';
/*
 * EXPORTING REDUCERS and SAGAS
 */
import getAppConfig, { getAppConfigReducer } from './actions/getAppConfig';
import { setCategoryTagReducer } from './actions/setCategoryTag';

export const initialState = {
  currentCategory: 'created',
  currentTag: 'utopian-io',
};

export const reducer = (state = initialState, action) => combine(
  [ getAppConfigReducer, setCategoryTagReducer ],
  state,
  action,
);

// All sagas to be loaded
export default [
  getAppConfig,
];
