import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { Button } from 'antd';

import { resteemBegin } from '../actions/resteem';
import { selectPostByPermlink } from '../selectors';

function ResteemButton(props) {
  const { post } = props;

  return (
    <Button
      type="default"
      size="small"
      icon="retweet"
      className="resteem-button"
      loading={post.isResteeming}
      onClick={() => props.resteem(post)}
    >
      Resteem
    </Button>
  );
}

ResteemButton.propTypes = {
  post: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  resteem: post => dispatch(resteemBegin(post)),
});

export default connect(mapDispatchToProps)(ResteemButton);
