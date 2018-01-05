import update from 'immutability-helper';

/*--------- CONSTANTS ---------*/
const UPDATE_DRAFT = 'UPDATE_DRAFT';

/*--------- ACTIONS ---------*/

export function updateDraft(field, value) {
  return { type: UPDATE_DRAFT, field, value };
}

/*--------- REDUCER ---------*/
export function updateDraftReducer(state, action) {
  switch (action.type) {
    case UPDATE_DRAFT: {
      return update(state, {
        draft: { $merge: { [action.field]: action.value } },
      });
    }
    default:
      return state;
  }
}
