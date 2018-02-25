/**
 * Sort comments based on payout
 * @param {Array} list - list of IDs of comments
 * @param {Object} commentsData - state.comments in redux setup
 * @param {String} sortBy - how comments should be sorted
 * @returns {Array} - list of sorted IDs
 */
export const sortCommentsFromSteem = (list, commentsData, sortBy = 'trending') => {
  let compareFunc;
  const newList = [...list];

  if (sortBy === 'trending') {
    compareFunc = (itemA, itemB) => {
      if (!itemA || !itemB) {
        return 0;
      }
      let compareRes = parseFloat(itemA.total_payout_value) - parseFloat(itemB.total_payout_value);
      if (compareRes === 0) {
        compareRes = itemA.net_votes - itemB.net_votes;
      }
      if (compareRes === 0) {
        compareRes = Date.parse(itemB.created) - Date.parse(itemA.created); // older goes first
      }
      return compareRes;
    };
  } else if (sortBy === 'votes') {
    compareFunc = (itemA, itemB) => itemA.net_votes - itemB.net_votes;
  } else if (sortBy === 'new') {
    compareFunc = (itemA, itemB) => Date.parse(itemA.created) - Date.parse(itemB.created);
  } else if (sortBy === 'old') {
    compareFunc = (itemA, itemB) => Date.parse(itemB.created) - Date.parse(itemA.created);
  }

  return newList.sort((item1, item2) =>
    compareFunc(commentsData[item1], commentsData[item2])
  ).reverse();
};
