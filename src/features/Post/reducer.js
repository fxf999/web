import update from 'immutability-helper';
import {
  UPDATE_PAYOUT,
  VOTE_FAILURE,
  VOTE_OPTIMISTIC,
  VOTE_SUCCESS
} from 'features/Vote/actions/vote';
import { manageContentVote } from 'features/Vote/utils';
import { getPostByKey } from './utils';
import { calculateContentPayout } from 'utils/helpers/steemitHelpers';

/*--------- REDUCER ---------*/
export default function postsReducer(state, action) {
  switch (action.type) {
    case VOTE_OPTIMISTIC: {
      const { content, accountName, weight, contentType } = action;
      if (contentType === 'post') {
        const { day, rank, post } = getPostByKey(state.posts, content.author, content.permlink);
        console.log('selected ------------>', day, rank, post);
        const newPost = manageContentVote({ ...post }, weight, accountName);
        return update(state, {
          posts: {
            [day]: { [rank]: { $set: newPost } },
          },
        });
      } else {
        return state;
      }
    }
    case VOTE_FAILURE: { // Revert on optimistic pre-update
      const { content, accountName, contentType } = action;
      if (contentType === 'post') {
        const { day, rank } = getPostByKey(state.posts, content.author, content.permlink);
        return update(state, {
          posts: { [day]: { [rank]: {
            active_votes: {
              $apply: votes => {
                return votes.filter(vote => {
                  if (vote.voter !== accountName) {
                    return true;
                  }
                  return false;
                });
              }
            }
          }}},
        });
      } else {
        return state;
      }
    }
    case VOTE_SUCCESS: {
      const { content, contentType } = action;
      if (contentType === 'post') {
        const { day, rank } = getPostByKey(state.posts, content.author, content.permlink);
        return update(state, {
          posts: { [day]: { [rank]: {
            isUpdating: { $set: true },
          }}},
        });
      } else {
        return state;
      }
    }
    case UPDATE_PAYOUT: {
      const { content, contentType } = action;
      if (contentType === 'post') {
        const { day, rank } = getPostByKey(state.posts, content.author, content.permlink);
        return update(state, {
          posts: { [day]: { [rank]: {
            payout_value: { $set: calculateContentPayout(content) },
            active_votes: { $set: content.active_votes },
            isUpdating: { $set: false },
          }}},
        });
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}
