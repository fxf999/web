import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { Spin } from 'antd';

import { selectPosts, selectIsLoading } from './selectors';
import { getPostsBegin } from './actions/getPosts';
import getPostKey from './utils/postKey';
import Post from './components/Post';

class PostList extends Component {
  static propTypes = {
    daysAgo: PropTypes.number.isRequired,
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super();
  }

  componentDidMount() {
    this.props.getPosts(this.props.daysAgo);
  }

  render() {
    const { daysAgo, isLoading } = this.props;
    const posts = (this.props.posts[daysAgo] || []).map((post, index) => {
      return (
        <Post key={post.id} rank={index + 1} post={post} />
      );
    });

    return (
      <Spin size="large" spinning={isLoading}>
        <div class="post-list">
          {posts}
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  posts: selectPosts(),
  isLoading: selectIsLoading(),
});

const mapDispatchToProps = dispatch => ({
  getPosts: (daysAgo) => dispatch(getPostsBegin(daysAgo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
