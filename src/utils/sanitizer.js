const DEFAULT_TAG = 'steemhunt';

export const splitTags = function(string) {
  return string
    .toLowerCase()
    .split(/[,\s]+/)
    .filter((s) => {
      return s; // remove empty values
    })
    .filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos && arr[pos] !== DEFAULT_TAG; // remove duplicated values
    });
};
