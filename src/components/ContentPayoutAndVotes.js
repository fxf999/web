import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';
import { sortVotes } from 'utils/helpers/voteHelpers';
import VotePayout from 'features/Vote/VotePayout';
import Author from 'components/Author';

const NB_SHOW_VOTES = 15;

export default class ContentPayoutAndVotes extends PureComponent {
  static propTypes = {
    content: PropTypes.object.isRequired,
  };

  render() {
    const { content } = this.props;

    const activeVotes = content.active_votes.filter(v => v.percent !== 0);
    if (activeVotes.length === 0) {
      return (
        <span className="vote-count">
          <span className="fake-link hover-link">0 votes</span>
        </span>
      );
    }

    // Generate voting-details
    const totalRshares = activeVotes.reduce((total, vote) => total + (parseInt(vote.rshares, 10) || 0), 0);

    // if cashout_time is set (not cashed out yet), use pending_payout_value, otherwise, use total_payout_value
    let totalPayout;
    if (content.payout_value) {
      totalPayout = content.payout_value;
    } else {
      totalPayout = content.cashout_time.indexOf('1969') === -1 ? parseFloat(content.pending_payout_value) : parseFloat(content.total_payout_value);
    }

    const lastVotes =
      sortVotes(activeVotes, 'rshares')
        .reverse()
        .slice(0, NB_SHOW_VOTES);

    const lastVotesTooltipMsg = lastVotes.map(vote => (
      <div className="voting-list" key={vote.voter}>
        <Author name={vote.voter} />
        <span className="weight">({vote.percent / 100}%)</span>
        <VotePayout vote={vote} totalRshares={totalRshares} totalPayout={totalPayout} />
      </div>
    ));
    if (activeVotes.length > NB_SHOW_VOTES) lastVotesTooltipMsg.push(
      <div key="...">
        ... and <strong>{activeVotes.length - 5}</strong> more votes.
      </div>
    );

    return (
      <span className="vote-count">
        <Popover content={lastVotesTooltipMsg} placement="bottom">
          <span className="fake-link hover-link">{`${activeVotes.length} votes`}</span>
        </Popover>
      </span>
    )
  }
}
