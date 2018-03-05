import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Popconfirm } from 'antd';
import { resteemBegin } from '../actions/resteem';

function ResteemButton(props) {
  const { post } = props;

  return (
    <Popconfirm title="Are you sure to resteem this post?" onConfirm={() => props.resteem(post)} okText="Yes" cancelText="No">
      <Button
        type="default"
        size="small"
        icon="retweet"
        className="resteem-button"
        loading={post.isResteeming}
      >
        Resteem
      </Button>
    </Popconfirm>
  );
}

ResteemButton.propTypes = {
  post: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  resteem: post => dispatch(resteemBegin(post)),
});

export default connect(null, mapDispatchToProps)(ResteemButton);
