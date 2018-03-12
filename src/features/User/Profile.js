import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { Icon, Timeline } from 'antd';
import { setCurrentUserBegin } from './actions/setCurrentUser';
import { selectMe, selectCurrentAccount, selectFollowingsList } from 'features/User/selectors';
import { COLOR_PRIMARY, COLOR_LIGHT_GREY } from 'styles/constants';
import UserSteemPower from './components/UserSteemPower';
import UserEstimatedValue from './components/UserEstimatedValue';
import FollowerCount from './components/FollowerCount';
import FollowButton from './components/FollowButton';
import { getFollowingsBegin } from './actions/getFollowings';
import { toTimeAgo } from 'utils/date';

class Profile extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
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
    myFollowings: PropTypes.array,
  };

  static defaultProps = {
    me: undefined,
    account: {
      name: undefined,
      reputation: 0,
      post_count: 0,
      follower_count: 0,
      following_count: 0,
    },
    myFollowings: undefined,
  };

  componentDidMount() {
    const { match } = this.props;
    if (match.params.author !== this.props.account.name) {
      this.props.setCurrentUser(match.params.author);
    }

    if (this.props.myFollowings === undefined && this.props.me) {
      this.props.getFollowings(this.props.me);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.author !== this.props.account.name) {
      this.props.setCurrentUser(nextProps.match.params.author);
    }

    if (nextProps.myFollowings === undefined && nextProps.me) {
      this.props.getFollowings(nextProps.me);
    }
  }

  render() {
    const { account } = this.props;
    if (isEmpty(account)) {
      return <div></div>;
    }

    let profile = account.json_metadata.profile || {};
    let coverStyle;
    if (profile.cover_image) {
      coverStyle = {
        backgroundColor: COLOR_PRIMARY,
        backgroundImage: 'url(https://steemitimages.com/1600x800/' + profile.cover_image + ')',
        backgroundSize: 'cover',
      };
    }
    const profileStyle = {
      backgroundColor: COLOR_LIGHT_GREY,
      backgroundImage: `url(https://i.imgur.com/NpAquFa.png)`,
    };
    if (profile.profile_image) {
      profileStyle['backgroundImage'] = `url(${process.env.REACT_APP_STEEMCONNECT_IMG_HOST}/@${account.name}?s=280)`;
    }

    return (
      <div className="profile diagonal-split-view">
        <Helmet>
          <title>@{account.name} - Steemhunt</title>
        </Helmet>
        <div className="top-container primary-gradient" style={coverStyle}>
          <h1>{profile.name || account.name}</h1>
          <h2>{profile.about}</h2>
          <FollowButton accountName={account.name} />
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          <div className="profile-picture" style={profileStyle}></div>
          <div className="timeline-container">
            <ul className="left">
              <li>Followers</li>
              <li>Reputation Score</li>
              <li>Steem Power</li>
              <li>Current Voting Power</li>
              <li>Estimated Value</li>
            </ul>

            <Timeline>
              <Timeline.Item><FollowerCount author={account.name} unit="followers" /></Timeline.Item>
              <Timeline.Item>{account.reputation}</Timeline.Item>
              <Timeline.Item><UserSteemPower account={account} /></Timeline.Item>
              <Timeline.Item>{parseInt(account.voting_power / 100, 10)}%</Timeline.Item>
              <Timeline.Item><UserEstimatedValue account={account} /></Timeline.Item>
            </Timeline>
          </div>

          <div className="other-info">
            { profile.website &&
              <p><a href={profile.website} target="_blank"><Icon type="link" /> {profile.website.replace(/^https?:\/\//, '')}</a></p>
            }
            <p><Icon type="calendar" /> Joined {toTimeAgo(account.created)}</p>
            <p><Icon type="book" /> <a href={`https://steemit.com/@${account.name}`} target="_blank" rel="noopener noreferrer">View Steemit blog</a></p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  me: selectMe(),
  account: selectCurrentAccount(),
  myFollowings: selectFollowingsList(state.me),
});

const mapDispatchToProps = (dispatch, props) => ({
  setCurrentUser: user => dispatch(setCurrentUserBegin(user)),
  getFollowings: me => dispatch(getFollowingsBegin(me)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
