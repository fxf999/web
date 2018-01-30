import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Popover, Button } from 'antd';

import { getUpvotes, sortVotes } from 'utils/helpers/voteHelpers';
import VotePayout from 'features/Vote/VotePayout';
import Author from 'components/Author';

const NB_SHOW_VOTES = 15;

export default class ContentPayoutAndVotes extends PureComponent {
  static propTypes = {
    content: PropTypes.object.isRequired,
  };

  render() {
    const { content } = this.props;

    // Generate voting-details
    let lastVotesTooltipMsg;
    if (content.net_votes !== 0) {
      const totalRshares = content.active_votes.reduce((total, vote) => total + parseInt(vote.rshares, 10), 0);
      // if cashout_time is set (not cashed out yet), use pending_payout_value, otherwise, use total_payout_value
      const totalPayout = content.cashout_time.indexOf('1969') === -1 ? parseFloat(content.pending_payout_value) : parseFloat(content.total_payout_value);
      const lastVotes =
        sortVotes(content.active_votes, 'rshares')
          .reverse()
          .slice(0, NB_SHOW_VOTES);

      lastVotesTooltipMsg = lastVotes.map(vote => (
        <div className="voting-list" key={vote.voter}>
          <Author name={vote.voter} />
          <span className="weight">({vote.percent / 100}%)</span>
          <VotePayout vote={vote} totalRshares={totalRshares} totalPayout={totalPayout} />
        </div>
      ));
      if (content.net_votes > NB_SHOW_VOTES) lastVotesTooltipMsg.push(
        <div key="...">
          ... and <strong>{content.active_votes.length - 5}</strong> more votes.
        </div>
      );
    }

    return (
      <div className="vote-count">
        {content.net_votes === 0 ? (
          <span className="fake-link hover-link">{`${content.net_votes} votes`}</span>
        ) : (
          <Popover content={lastVotesTooltipMsg} placement="bottom">
            <span className="fake-link hover-link">{`${content.net_votes} votes`}</span>
          </Popover>
        )}
      </div>
    )
  }
}
