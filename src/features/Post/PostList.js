import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Spin } from 'antd';

import { selectPosts, selectIsLoading } from './selectors';
import { getPostsBegin } from './actions/getPosts';
import { daysAgoToString } from 'utils/date';
import Post from './components/Post';
import { formatAmount } from "utils/helpers/steemitHelpers";

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
    let dailyTotalReward = 0;
    const posts = (this.props.posts[daysAgo] || []).map((post, index) => {
      dailyTotalReward += post.payout_value;
      return (
        <Post key={post.id} rank={index + 1} post={post} />
      );
    });
    return (
      <Spin size="large" spinning={isLoading}>
        <div className="post-list">
          <div className="heading">
            <h3>{daysAgoToString(daysAgo)}</h3>
            <p><b>{posts.length}</b> products, <b>{formatAmount(dailyTotalReward)}</b> hunter’s rewards were generated.</p>
          </div>
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
