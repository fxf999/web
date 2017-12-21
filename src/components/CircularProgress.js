import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

const CircularProgress = props => {
  return (
    <Icon type="loading" spin="true" style={{ fontsize: (props.size || 60) }} />
  )
};

CircularProgress.propTypes = {
  size: PropTypes.number
};

export default CircularProgress;
