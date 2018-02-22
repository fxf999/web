import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

function UserSteemPower({ account }) {
  return (
    <span>
      {numeral(account.steemPower).format('0,0')+' SP '}
      { account.steemPowerReceived > 0 &&
        ' (+'+numeral(account.steemPowerReceived).format('0,0')+' SP)'
      }
    </span>
  );
}

UserSteemPower.propTypes = {
  account: PropTypes.object.isRequired,
};

export default UserSteemPower;
