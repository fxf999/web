import React from 'react';
import PropTypes from 'prop-types';
import { formatAmount } from "utils/helpers/steemitHelpers";

export default function VotePayout({ vote, totalRshares, totalPayout }) {
  const value = (vote.rshares / totalRshares * totalPayout) || 0;

  return (
    <span className="value">
      {formatAmount(value)}
    </span>
  );
}

VotePayout.propTypes = {
  vote: PropTypes.object.isRequired,
  totalRshares: PropTypes.number.isRequired,
  totalPayout: PropTypes.number.isRequired,
};
