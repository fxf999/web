export const toCustomISOString = function(date) {
  return date.toISOString().split('.')[0];
}