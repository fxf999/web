import update from 'immutability-helper';

/*--------- CONSTANTS ---------*/
const UPDATE_PREVIEW = 'UPDATE_PREVIEW';

/*--------- ACTIONS ---------*/

export function updatePreview(post) {
  return { type: UPDATE_PREVIEW, post };
}

/*--------- REDUCER ---------*/
export function updatePreviewReducer(state, action) {
  switch (action.type) {
    case UPDATE_PREVIEW: {
      return update(state, {
        draft: { $merge: action.post },
      });
    }
    default:
      return state;
  }
}
