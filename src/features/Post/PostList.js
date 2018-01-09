import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import React, { Component } from 'react';
import { List, Button, Spin } from 'antd';

import { selectPosts, selectIsLoading } from './selectors';
import { getPostsBegin } from './actions/getPosts';
import getPostKey from './utils/postKey';

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
    const { daysAgo, posts, isLoading } = this.props;
    const listData = posts[daysAgo];

    return (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={listData}
        renderItem={post => (
          <List.Item
            key={post.id}
            extra={<img width={272} alt="logo" src={post.images[0].link} />}
          >
            <List.Item.Meta
              title={<a href={getPostKey(post)}>{post.title}</a>}
              description={post.tagline}
            />
            {post.tagline}
          </List.Item>
        )}
      />
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
