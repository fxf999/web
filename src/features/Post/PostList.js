import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { selectPosts } from './selectors';
import { getPostsBegin } from './actions/getPosts';
import { daysAgoToString } from 'utils/date';
import PostItem from './components/PostItem';
import { formatAmount } from "utils/helpers/steemitHelpers";

class PostList extends Component {
  static propTypes = {
    daysAgo: PropTypes.number.isRequired,
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.object.isRequired,
  };

  constructor(props) {
    super();
  }

  componentDidMount() {
    this.props.getPosts(this.props.daysAgo);
  }

  render() {
    const { posts, daysAgo } = this.props;

    let dailyTotalReward = 0;
    let dailyPosts = posts[daysAgo]
    if (isEmpty(dailyPosts)) {
      return null;
    }

    dailyPosts = dailyPosts.map((post, index) => {
      dailyTotalReward += post.payout_value;
      return (
        <PostItem key={post.id} rank={index + 1} post={post} />
      );
    });

    return (
      <div className="post-list">
        <div className="heading">
          <h3>{daysAgoToString(daysAgo)}</h3>
          <p><b>{posts.length}</b> products, <b>{formatAmount(dailyTotalReward)}</b> hunter’s rewards were generated.</p>
        </div>
        <div className="daily-posts">
          {dailyPosts}
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  posts: selectPosts(),
});

const mapDispatchToProps = dispatch => ({
  getPosts: (daysAgo) => dispatch(getPostsBegin(daysAgo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
