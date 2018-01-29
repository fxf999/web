// TODO: DEPRECATE

import React from 'react';
import PropTypes from 'prop-types';
import SmallFlatButton from './SmallFlatButton';

const ReplyButton = ({ onClick }) => {
  return (
    <SmallFlatButton
      label="Reply"
      onClick={onClick}
      icon="retweet"
    />
  )
};

ReplyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ReplyButton;
