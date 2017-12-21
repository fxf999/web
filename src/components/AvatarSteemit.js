import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Progress } from 'antd';

const AvatarSteemit = ({ name, size, votingPower }) => {
  const percentVotingPower = votingPower ? parseInt(votingPower / 100, 10) : 0;

  return (
    <div className="avatar-steemit" style={{ width: size, height: size }}>
      {votingPower && <Progress
        type="circle"
        percent={percentVotingPower}
        showInfo={false}
        status="active"
        strokeWidth={5}
        width={size}
        style={{
          position: 'absolute',
          transform: 'translate(-50%,-50%)',
          top: '50%',
          left: '50%',
        }}
      />}

      <Avatar
        src={`${process.env.REACT_APP_STEEMCONNECT_IMG_HOST}/@${name}?s=${size}`}
        size="large"
        style={{
          position: 'absolute',
          transform: 'translate(-50%,-50%)',
          top: '50%',
          left: '50%'
        }}
      />
    </div>
  )
};

AvatarSteemit.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  votingPower: PropTypes.number,
};

AvatarSteemit.defaultProps = {
  size: 48,
  votingPower: undefined,
};

export default AvatarSteemit;
