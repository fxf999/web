import 'whatwg-fetch';

const API_ROOT = process.env.REACT_APP_API_ROOT;

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300 || res.status === 422) {
    return res;
  }

  throw new Error(res.statusText + '. Please try again later.');
}

function parseJSON(res) {
  return res.json();
}

function checkError(json) {
  if (json.error) {
    throw new Error(json.error);
  }

  return json
}

function getQueryString(params) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
}

function request(method, path, params) {
  var qs = '';
  var body;
  var headers = params.headers || {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (['GET', 'DELETE'].indexOf(method) > -1) {
    qs = '?' + getQueryString(params || {});
  } else { // POST or PUT
    body = JSON.stringify(params || {});
  }
  var url = API_ROOT + path + qs;

  return fetch(url, { method, headers, body })
    .then(checkStatus)
    .then(parseJSON)
    .then(checkError);
}

export default {
  get: (path, params) => request('GET', path, params),
  post: (path, params) => request('POST', path, params),
  put: (path, params) => request('PUT', path, params),
  delete: (path, params) => request('DELETE', path, params)
};
