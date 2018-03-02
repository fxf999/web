import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import numeral from 'numeral';

import { Icon, Button, Slider, Popover } from 'antd';

import { selectIsConnected, selectMyAccount } from 'features/User/selectors';
import { selectAppProps, selectAppRate, selectAppRewardFund } from 'features/App/selectors';
import { voteBegin } from './actions/vote';
import { hasVoted } from 'utils/helpers/steemitHelpers';
import { formatAmount } from 'utils/helpers/steemitHelpers';

class VoteButton extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    layout: PropTypes.string.isRequired,

    appProps: PropTypes.object,
    myAccount: PropTypes.object.isRequired,
    isConnected: PropTypes.bool.isRequired,

    vote: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      voteWeight: 100, // TODO: Remember the last one
      sliderOpened: false,
    }
  }

  openSignin = () => {
    console.log('TODO: Open sign in pop up');
  };

  onChangeVotingWeight = value => {
    this.setState({ voteWeight: value });
  };

  doVote = weight => {
    const { isConnected, post, vote, type } = this.props;

    if (isConnected) {
      vote(post, weight, type);
      this.setState({ sliderOpened: false });
    } else {
      console.log('Not logged in');
    }
  };

  handleVisibleChange = (visible, postUpvoted) => {
    if (visible) {
      if (!this.props.isConnected) {
        return this.openSignin();
      }

      if (postUpvoted) { // Cancel voting if already voted
        return this.doVote(0);
      }
    }
    this.setState({ sliderOpened: visible });
  };

  votingValueCalculator = voteWeight => {
    const { appProps, rewardFund, myAccount } = this.props;
    if (!appProps) {
      return 0;
    }

    const { steemPower, voting_power } = myAccount;
    const { total_vesting_fund_steem, total_vesting_shares } = appProps;
    const { reward_balance, recent_claims } = rewardFund;

    const totalVestingFundSteem = parseFloat(total_vesting_fund_steem);
    const totalVestingShares = parseFloat(total_vesting_shares);
    const a = totalVestingFundSteem / totalVestingShares;

    const rewardBalance = parseFloat(reward_balance);
    const recentClaims = parseFloat(recent_claims);
    const rate = parseFloat(this.props.rate);
    const r = steemPower / a;
    let p = voting_power * voteWeight * 100 / 10000;
    p = (p + 49) / 50;
    const result = r * p * 100 * (rewardBalance / recentClaims * rate);
    return result;
  };

  render() {
    const { myAccount, isConnected, post, layout } = this.props;
    const { voteWeight, sliderOpened } = this.state;
    const postUpvoted = hasVoted(post, myAccount.name);

    const content = isConnected ? (
      <div className="vote-box">
        <Slider
          min={0}
          max={100}
          step={1}
          value={voteWeight}
          onChange={this.onChangeVotingWeight}
        />
        <div className="weight">
          {voteWeight}%
          ({numeral(this.votingValueCalculator(voteWeight)).format('$0,0.00')})
        </div>
        <Button
          type="primary"
          onClick={() => this.doVote(voteWeight * 100)}
          disabled={voteWeight === 0}>
          Vote
        </Button>
      </div>
    ) : '';

    if (layout === 'list') {
      return (
        <div className={`vote-button${postUpvoted ? ' active' : ''}`}>
          <Popover
            content={content}
            trigger="click"
            placement="left"
            visible={sliderOpened}
            onVisibleChange={(visible) => this.handleVisibleChange(visible, postUpvoted)}
          >
            <Button
              type="primary"
              shape="circle"
              icon="up"
              ghost={postUpvoted ? false : true}
              loading={post.isUpdating}
            />
          </Popover>
          <div className="payout-value">{formatAmount(post.payout_value)}</div>
        </div>
      );
    } else if (layout ==='detail-page') {
      return (
        <div className={`vote-button${postUpvoted ? ' active' : ''}`}>
          <Popover
            content={content}
            trigger="click"
            placement="top"
            visible={sliderOpened}
            onVisibleChange={(visible) => this.handleVisibleChange(visible, postUpvoted)}
          >
            <Button
              type="primary"
              ghost={postUpvoted ? false : true}
              loading={post.isUpdating}
            >
              <Icon type="up" />
              UPVOTE
              <div className="payout-value">{formatAmount(post.payout_value)}</div>
            </Button>
          </Popover>
        </div>
      );
    } else { // comment
      return (
        <div className={`vote-button${postUpvoted ? ' active' : ''}`}>
          <Popover
            content={content}
            trigger="click"
            placement="top"
            visible={sliderOpened}
            onVisibleChange={(visible) => this.handleVisibleChange(visible, postUpvoted)}
          >
            <Button
              type="primary"
              shape="circle"
              icon="up"
              size="small"
              ghost={postUpvoted ? false : true}
              loading={post.isUpdating}
            />
          </Popover>
          <span className="payout-value">{formatAmount(post.payout_value)}</span>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  myAccount: selectMyAccount(),
  isConnected: selectIsConnected(),
  appProps: selectAppProps(),
  rate: selectAppRate(),
  rewardFund: selectAppRewardFund(),
});

const mapDispatchToProps = (dispatch, props) => ({
  vote: (post, weight, params) => dispatch(voteBegin(post, weight, props.type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VoteButton);
