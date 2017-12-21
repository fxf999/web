import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import { COLOR_BUTTONS } from 'styles/constants';

const SmallFlatButton = ({ label, icon, color, ...rest }) => {
  return (
    <Button
      icon={<Icon type={icon} />}
      style={{ height: 32, lineHeight: '32px', minWidth: 60, whiteSpace: 'nowrap', color: color }}
      {...rest}
    >
    </Button>
  )
};

SmallFlatButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.func,
  color: PropTypes.string,
};

SmallFlatButton.defaultProps = {
  color: COLOR_BUTTONS,
};

export default SmallFlatButton;
