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

export const toTimeAgo = function(dateString) {
  return moment(dateString + 'Z').fromNow();
}

export const timeUntilMidnightSeoul = function() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);
  const minutesTillMidnight = (midnight.getTime() - now.getTime()) / 1000 / 60;

  const timeGapFromSeoul = now.getTimezoneOffset() + 540; // GMT + 9:00
  let seoulTillMidnight = Math.floor(minutesTillMidnight - timeGapFromSeoul);
  if (seoulTillMidnight < 0) {
    seoulTillMidnight = 24 * 60 - seoulTillMidnight;
  }

  let hours   = Math.floor(seoulTillMidnight / 60);
  let minutes = Math.floor(seoulTillMidnight - (hours * 60));

  return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''} left for today's ranking, based on KST midnight (GMT + 9)`;
};

export const shortFormat = function(dateString) {
  const date = moment(dateString);
  if ((Date.now() - date.valueOf()) / 1000 < 86400) {
    return date.fromNow();
  }
  return date.format('MMM Do, YYYY');
}
