import update from 'immutability-helper';
import { manageContentVote } from '../Vote/utils';
import { UPDATE_PAYOUT, VOTE_FAILURE, VOTE_OPTIMISTIC } from '../Vote/actions/vote';
import { GET_COMMENTS_FROM_POST_SUCCESS } from './actions/getCommentsFromPost';
import { GET_COMMENTS_FROM_USER_SUCCESS } from './actions/getCommentsFromUser';
import { GET_REPLIES_TO_USER_SUCCESS } from './actions/getRepliesToUser';
import { getCommentsChildrenLists, mapCommentsBasedOnId } from './utils/comments';

export default function commentsReducer(state, action) {
  switch (action.type) {
    case GET_COMMENTS_FROM_POST_SUCCESS:
    case GET_COMMENTS_FROM_USER_SUCCESS:
    case GET_REPLIES_TO_USER_SUCCESS: {
      return update(state, {
        commentsChild: { $merge: getCommentsChildrenLists(action.state) },
        commentsData: { $merge: mapCommentsBasedOnId(action.state.content) },
      });
    }
    case VOTE_OPTIMISTIC: {
      const { content, accountName, weight, contentType } = action;
      if (contentType === 'comment') {
        const newComment = manageContentVote({ ...state.commentsData[content.id] }, weight, accountName);
        newComment.isUpdating = true;
        return update(state, {
          commentsData: {
            [content.id]: {$set:
              newComment,
            }
          }
        });
      } else {
        return state;
      }
    }
    case VOTE_FAILURE: {
      const { content, accountName, contentType } = action;
      if (contentType === 'comment') {
        return update(state, {
          commentsData: {
            [content.id]: {
              active_votes: {$apply: votes => {
                return votes.filter(vote => {
                  if (vote.voter !== accountName) {
                    return true;
                  }
                  return vote.percent <= 0;
                });
              }},
              net_votes: {$apply: count => count - 1}
            }
          },
        });
      } else {
        return state;
      }
    }
    case UPDATE_PAYOUT: {
      const { content, contentType } = action;
      if (contentType === 'comment') {
        return update(state, {
          commentsData: {
            [content.id]: {
              pending_payout_value: {$set: content.pending_payout_value},
              total_payout_value: {$set: content.total_payout_value},
              active_votes: {$set: content.active_votes},
              isUpdating: {$set: false},
            }
          },
        });
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}
