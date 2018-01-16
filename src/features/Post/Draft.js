import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { selectDraft } from './selectors';
import PostView from './components/PostView';

class Draft extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    return (
      <PostView post={this.props.post} />
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  post: selectDraft(),
});

export default connect(mapStateToProps)(Draft);
