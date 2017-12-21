import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import numeral from 'numeral';

import { Button, Slider } from 'antd';

import { selectIsConnected, selectMyAccount } from 'features/User/selectors';
import { selectAppProps, selectAppRate, selectAppRewardFund } from 'features/App/selectors';
import { voteBegin } from './actions/vote';
import { hasVoted } from 'utils/helpers/steemitHelpers';

class VoteButton extends Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
    myAccount: PropTypes.object.isRequired,
    isConnected: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    vote: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      voteWeight: 100,
      sliderIsOpen: false,
      over: false,
    }
  }

  closeSlider = () => {
    this.setState({ sliderIsOpen: false, over: false });
  };

  handleVoteWeight = (event, value) => {
    this.setState({ voteWeight: value });
  };

  openSlider = () => {
    this.setState({ sliderIsOpen: true });
  };

  overIn = () => {
    this.setState({ over: true });
  };

  overOut = () => {
    this.setState({ over: false });
  };

  vote = weight => {
    const { isConnected, content, vote, type } = this.props;
    if (isConnected) {
      this.setState({ sliderIsOpen: false });
      vote(content, weight, { type });
    } else {
      console.log('Not logged');
    }
  };

  votingValueCalculator = voteWeight => {
    const { appProps, rewardFund, myAccount } = this.props;
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
    const { myAccount, isConnected, content } = this.props;
    const { voteWeight, sliderIsOpen, over } = this.state;
    const contentUpvoted = hasVoted(content, myAccount.name);

    return (
      <div>
        {isConnected && (
          <div className={`Vote ${contentUpvoted ? 'active' : ''}`} onMouseEnter={this.overIn}
               onMouseLeave={this.overOut}>
            <Button
              shape="circle"
              icon="up-circle"
              disabled={!isConnected}
              onClick={!contentUpvoted ? this.openSlider : () => this.vote(0)}
              style={{
                color: contentUpvoted || over ? '#fff' : '#ccc'
              }}
            />
            {sliderIsOpen && (
              <div className="CardBox">
                <div className="Slider">
                  <Slider
                    sliderStyle={{ marginBottom: 24 }}
                    min={0}
                    max={100}
                    step={1}
                    value={voteWeight}
                    onChange={this.handleVoteWeight}
                  />
                  <div className="Weight">{voteWeight}%
                    ({numeral(this.votingValueCalculator(voteWeight)).format('$0,0.00')})
                  </div>
                </div>

                <Button
                  type="primary"
                  onClick={() => this.vote(voteWeight * 100)}
                  disabled={voteWeight === 0}>
                  Vote
                </Button>

                <Button onClick={this.closeSlider}>Close</Button>
              </div>
            )}
          </div>
        )}
      </div>
    )
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
  vote: (content, weight, params) => dispatch(voteBegin(content, weight, props.type, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VoteButton);
