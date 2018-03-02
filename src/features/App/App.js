import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { selectAppProps } from './selectors';
import { getAppConfigBegin } from './actions/getAppConfig';
import { RoutesLeft, RoutesRight } from 'Routes';

import 'custom.css';

class App extends Component {

  componentDidMount() {
    if (isEmpty(this.props.appProps)) {
      this.props.getAppConfig();
    }
  }

  render() {
    return (
      <div id="app-container" className="app-container">
        <Helmet>
          <title>Steemhunt - Dig Products, Earn STEEMs</title>
          {/* Search Engine */}
          <meta name="description" content="Daily ranking of effortlessly cool products fueled by STEEM blockchain" />
          <meta name="image" content="https://steemhunt.com/og-image.jpg" />
          {/* Schema.org for Google */}
          <meta itemprop="name" content="Steemhunt - Dig Products, Earn STEEMs" />
          <meta itemprop="description" content="Daily ranking of effortlessly cool products fueled by STEEM blockchain" />
          <meta itemprop="image" content="https://steemhunt.com/og-image.jpg" />
          {/* Twitter */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Steemhunt - Dig Products, Earn STEEMs" />
          <meta name="twitter:description" content="Daily ranking of effortlessly cool products fueled by STEEM blockchain" />
          <meta name="twitter:image:src" content="https://steemhunt.com/og-image.jpg" />
          {/* Open Graph general (Facebook, Pinterest & Google+) */}
          <meta name="og:title" content="Steemhunt - Dig Products, Earn STEEMs" />
          <meta name="og:description" content="Daily ranking of effortlessly cool products fueled by STEEM blockchain" />
          <meta name="og:image" content="https://steemhunt.com/og-image.jpg" />
        </Helmet>
        <div className="split-container">
          <RoutesLeft />
          <RoutesRight />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  appProps: selectAppProps()
});

const mapDispatchToProps = (dispatch, props) => ({
  getAppConfig: () => dispatch(getAppConfigBegin()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
