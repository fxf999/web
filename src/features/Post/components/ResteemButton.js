import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { resteemBegin } from '../actions/resteem';

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

export default connect(null, mapDispatchToProps)(ResteemButton);
