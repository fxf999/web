// TODO: DEPRECATE

import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';

const SmallIconButton = ({ icon, ...rest }) => {
  return (
    <Button style={{ width: 32, height: 32, padding: 6 }} {...rest} icon="question-circle" />
  )
};

SmallIconButton.propTypes = {
  icon: PropTypes.func.isRequired,
};

export default SmallIconButton;
