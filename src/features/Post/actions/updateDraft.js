import update from 'immutability-helper';
import { initialState } from 'features/Post/actions';

/*--------- CONSTANTS ---------*/
const UPDATE_DRAFT = 'UPDATE_DRAFT';
const RESET_DRAFT = 'RESET_DRAFT';

/*--------- ACTIONS ---------*/

export function updateDraft(field, value) {
  return { type: UPDATE_DRAFT, field, value };
}

export function resetDraft() {
  return { type: RESET_DRAFT };
}

/*--------- REDUCER ---------*/
export function updateDraftReducer(state, action) {
  switch (action.type) {
    case UPDATE_DRAFT: {
      return update(state, {
        draft: { $merge: { [action.field]: action.value } },
      });
    }
    case RESET_DRAFT: {
      return update(state, {
        draft: { $set: initialState['draft'] },
      });
    }
    default:
      return state;
  }
}
