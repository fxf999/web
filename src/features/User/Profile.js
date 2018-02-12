import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';

import asyncComponent from 'asyncComponent';
import UserHeader from './components/UserHeader';
import UserMenu from './components/UserMenu';
import { setCurrentUserBegin } from './actions/setCurrentUser';
import { selectCurrentAccount } from './selectors';

class Profile extends Component {
  static propTypes = {
    account: PropTypes.shape({
      name: PropTypes.string,
      reputation: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      post_count: PropTypes.number,
      follower_count: PropTypes.number,
      following_count: PropTypes.number,
    }).isRequired,
  };

  static defaultProps = {
    account: {
      name: undefined,
      reputation: 0,
      post_count: 0,
      follower_count: 0,
      following_count: 0,
    }
  };

  componentDidMount() {
    const { match, account } = this.props;
    if (match.params.accountName !== account.name) {
      this.props.setCurrentUser(match.params.accountName);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.accountName !== this.props.match.params.accountName) {
      this.props.setCurrentUser(nextProps.match.params.accountName);
    }
  }

  render() {
    const { account, match } = this.props;
    const accountName = match.params.accountName;
    if (isEmpty(account)) {
      return <div></div>;
    }
    if (match.isExact) {
      return <Redirect to={`/@${accountName}/blog`} />;
    }
    return (
      <div className="profile_container">
        <UserHeader account={account} />
        <Helmet
          titleTemplate={`%s | @${accountName}`}
          defaultTitle={`@${accountName}`}
        />
        <div className="content">
          <UserMenu accountName={accountName} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  account: selectCurrentAccount(),
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUserBegin(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
