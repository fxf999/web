import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { getToken } from 'utils/token';
import './utils/helpers/immutabilityHelpers';
import store from './store';
import App from './features/App/App';
import registerServiceWorker from './registerServiceWorker';
import steemconnect from 'sc2-sdk';
import steem from 'steem';

steem.api.setOptions({ url: process.env.REACT_APP_STEEM_API_URL });

steemconnect.init({
  app: 'steemhunt.com',
  callbackURL: process.env.REACT_APP_STEEMCONNECT_REDIRECT_URL,
  accessToken: 'access_token',
  scope: [ 'login', 'vote', 'comment', 'comment_delete', 'comment_options', 'custom_json' ],
});
steemconnect.setAccessToken(getToken());

injectTapEventPlugin();

window.API_ROOT = process.env.REACT_APP_API_ROOT;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  , document.getElementById('root')
);
registerServiceWorker();
