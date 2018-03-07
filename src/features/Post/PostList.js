import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { Button } from 'antd';
import { selectPosts, selectDailyRanking } from './selectors';
import { getPostsBegin } from './actions/getPosts';
import { daysAgoToString } from 'utils/date';
import PostItem from './components/PostItem';
import { formatAmount } from "utils/helpers/steemitHelpers";

class PostList extends Component {
  static propTypes = {
    daysAgo: PropTypes.number.isRequired,
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.object.isRequired,
    dailyRanking: PropTypes.object.isRequired,
  };

  constructor(props) {
    super();

    if (props.daysAgo === 0) {
      this.state = { showAll: true };
    } else {
      this.state = { showAll: false };
    }
  }

  componentDidMount() {
    this.props.getPosts(this.props.daysAgo);
  }

  showAll = () => this.setState({ showAll: true });

  render() {
    const { posts, dailyRanking, daysAgo } = this.props;

    let ranking = dailyRanking[daysAgo];
    if (isEmpty(ranking)) {
      return null;
    }

    let dailyTotalReward = 0;
    const rankingItems = ranking.map((postKey, index) => {
      const post = posts[postKey];
      dailyTotalReward += post.payout_value;
      return (
        <PostItem key={post.id} rank={index + 1} post={post} />
      );
    });

    let buttonClass = 'show-all';
    if (this.state.showAll) {
      buttonClass += ' hide';
    }

    return (
      <div className={`post-list day-ago-${daysAgo}`}>
        <div className="heading">
          <h3>{daysAgoToString(daysAgo)}</h3>
          <p><b>{ranking.length}</b> products, <b>{formatAmount(dailyTotalReward)}</b> hunter’s rewards were generated.</p>
        </div>
        <div className="daily-posts">
          {rankingItems.slice(0,10)}
          {rankingItems.length > 10 &&
            <Button type="primary" size="default" className={buttonClass} ghost onClick={this.showAll}>Show All</Button>
          }
          {rankingItems.length > 10 && this.state.showAll && rankingItems.slice(10)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  posts: selectPosts(),
  dailyRanking: selectDailyRanking(),
});

const mapDispatchToProps = dispatch => ({
  getPosts: (daysAgo) => dispatch(getPostsBegin(daysAgo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
