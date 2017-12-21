import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Popover } from 'antd';

import { getUpvotes, sortVotes } from 'utils/helpers/voteHelpers';
import CircularProgress from 'components/CircularProgress';
import SmallFlatButton from 'components/SmallFlatButton';
import Payout from 'features/Comment/Payout';
import VoteButton from 'features/Vote/VoteButton';
import VotePayout from 'features/Vote/VotePayout';
import { calculateContentPayout, formatAmount } from 'utils/helpers/steemitHelpers';

const NB_SHOW_VOTES = 15;

export default class ContentPayoutAndVotes extends PureComponent {
  static propTypes = {
    content: PropTypes.object.isRequired, // Post or comment
    type: PropTypes.oneOf(['post', 'comment']).isRequired, // post or comment
  };

  render() {
    const { content, type } = this.props;
    const payout = calculateContentPayout(content);

    let lastVotesTooltipMsg;
    if (content.net_votes !== 0) {
      const totalRshares = content.active_votes.reduce((total, vote) => total + parseInt(vote.rshares, 10), 0);
      const totalPayout = content.cashout_time.indexOf('1969') === -1 ? parseFloat(content.pending_payout_value) : parseFloat(content.total_payout_value);
      const lastVotes =
        sortVotes(getUpvotes(content.active_votes), 'rshares')
          .reverse()
          .slice(0, NB_SHOW_VOTES);

      lastVotesTooltipMsg = lastVotes.map(vote => (
        <div className="Vote__details" key={vote.voter}>
          <div>
            <Link to={`/@${vote.voter}`}>
              {vote.voter}
            </Link>
            <span className="weight">({vote.percent / 100}%)</span>
          </div>
          <strong>
            <VotePayout vote={vote} totalRshares={totalRshares} totalPayout={totalPayout} />
          </strong>
        </div>
      ));
      if (content.net_votes > NB_SHOW_VOTES) lastVotesTooltipMsg.push(
        <div key="...">
          ... and <strong>{content.active_votes.length - 5}</strong> more votes.
        </div>
      );
    }

    return (
      <div className="Voting">
        <div className="Voting__button">
          <VoteButton content={content} type={type} />
        </div>
        <div className="Voting__money">
          {content.isUpdating && <CircularProgress size={20} style={{ marginRight: 10 }} />}
          {payout === 0 ? (
            <SmallFlatButton label={formatAmount(payout)} />
          ) : (
            <SmallFlatButton onClick={this.openMoneyCard} label={formatAmount(payout)} />
          )}
          {payout !== 0 && (
            <Popover content={<Payout content={content} />} visible="true" />
          )}
        </div>
        <div className="Voting__voters_list">
          {content.net_votes === 0 ? (
            <SmallFlatButton label={`${content.net_votes} votes`} />
          ) : (
            <SmallFlatButton onClick={this.openVoteCard} label={`${content.net_votes} votes`} />
          )}
          {content.net_votes !== 0 && (
            <Popover content={lastVotesTooltipMsg} visible="true" />
          )}
        </div>
      </div>
    )
  }
}
