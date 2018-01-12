var moment = require('moment');

export const toCustomISOString = function(date) {
  return date.toISOString().split('.')[0];
}

export const daysAgoToString = function(daysAgo) {
  if (daysAgo === 0) {
    return 'Today';
  }

  if (daysAgo === 1) {
    return 'Yesterday'
  }

  const date = new Date(new Date() - 86400000 * daysAgo);

  // Return weekday if less than a week
  if (daysAgo < 7) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[date.getDay()];
  }

  return moment(date).format('MMMM Do');
}