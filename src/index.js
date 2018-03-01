import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import registerServiceWorker from './registerServiceWorker';
import steem from 'steem';
import './utils/helpers/immutabilityHelpers';
import store from './store';
import App from './features/App/App';

steem.api.setOptions({ url: process.env.REACT_APP_STEEM_API_URL });

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
