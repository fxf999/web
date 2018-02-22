import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';

import { Button, Spin, Icon, Timeline } from 'antd';

import { setCurrentUserBegin } from './actions/setCurrentUser';
import { selectCurrentAccount } from './selectors';
import Loading from 'components/Loading';
import { COLOR_PRIMARY, COLOR_LIGHT_GREY } from 'styles/constants';
import UserSteemPower from './components/UserSteemPower';
import UserEstimatedValue from './components/UserEstimatedValue';
import FollowerCount from './components/FollowerCount';

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
    if (match.params.author !== account.name) {
      this.props.setCurrentUser(match.params.author);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.author !== this.props.match.params.author) {
      this.props.setCurrentUser(nextProps.match.params.author);
    }
  }

  render() {
    const { account } = this.props;
    if (isEmpty(account)) {
      return <div></div>;
    }

    const { profile } = account.json_metadata;
    let coverStyle, profileStyle;
    if (profile.cover_image) {
      coverStyle = {
        backgroundColor: COLOR_PRIMARY,
        backgroundImage: 'url(' + profile.cover_image + ')',
        backgroundSize: 'cover',
      };
    }
    if (profile.profile_image) {
      profileStyle = {
        backgroundColor: COLOR_LIGHT_GREY,
        backgroundImage: 'url(' + profile.profile_image + ')',
      }
    }

    return (
      <div className="profile diagonal-split-view">
        <div className="top-container primary-gradient" style={coverStyle}>
          <h1>{profile.name || account.name}</h1>
          <h2>{profile.about}</h2>
          <Button type="primary" htmlType="submit" className="round-border inversed-color padded-button">FOLLOW</Button>
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          <div className="profile-picture" style={profileStyle}>

          </div>
          <div className="timeline-container">
            <ul className="left">
              <li>Followers</li>
              <li>Reputation Score</li>
              <li>Steem Power</li>
              <li>Estimated Account Value</li>
            </ul>

            <Timeline>
              <Timeline.Item><FollowerCount author={account.name} unit="followers" /></Timeline.Item>
              <Timeline.Item>{account.reputation}</Timeline.Item>
              <Timeline.Item><UserSteemPower account={account} /></Timeline.Item>
              <Timeline.Item><UserEstimatedValue account={account} /></Timeline.Item>
            </Timeline>
          </div>
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
