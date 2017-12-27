import 'whatwg-fetch';

const API_ROOT = process.env.REACT_APP_API_ROOT;

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw response.statusText;
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
    .then(parseJSON);
}

export default {
  get: (path, params) => request('GET', path, params),
  post: (path, params) => request('POST', path, params),
  put: (path, params) => request('PUT', path, params),
  delete: (path, params) => request('DELETE', path, params)
};
