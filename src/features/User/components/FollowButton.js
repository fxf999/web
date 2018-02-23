import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Button } from 'antd';
import steemconnect from 'sc2-sdk';
import { selectMe, selectMyFollowingsList, selectMyFollowingsLoadStatus } from '../selectors';
import { followBegin } from '../actions/follow';
import { unfollowBegin } from '../actions/unfollow';

function FollowButton(props) {
  const { followingsList, followingLoadStatus, accountName, me, unfollow, follow } = props;
  const isFollowing = followingsList.find(following => following.following === accountName);
  const isLoading = followingLoadStatus[accountName];

  return me ? (
    <Button
      type="primary"
      className="round-border inversed-color padded-button"
      onClick={isFollowing ? unfollow : follow}
      disabled={accountName === me || isLoading}
      loading={isLoading}
    >
      {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
    </Button>
  ) : (
    <Button href={steemconnect.getLoginURL()} type="primary" className="round-border inversed-color padded-button">FOLLOW</Button>
  )
}

FollowButton.propTypes = {
  accountName: PropTypes.string.isRequired,
  me: PropTypes.string.isRequired,
  followingsList: PropTypes.array.isRequired,
  followingLoadStatus: PropTypes.object.isRequired,
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => createStructuredSelector({
  followingLoadStatus: selectMyFollowingsLoadStatus(),
  followingsList: selectMyFollowingsList(),
  me: selectMe(),
});

const mapDispatchToProps = (dispatch, props) => ({
  follow: () => dispatch(followBegin(props.accountName)),
  unfollow: () => dispatch(unfollowBegin(props.accountName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton);
