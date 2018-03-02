import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getPostKey } from '../utils';
import VoteButton from 'features/Vote/VoteButton';

export default class PostItem extends Component {
  static propTypes = {
    rank: PropTypes.number.isRequired,
    post: PropTypes.object.isRequired,
  };

  render() {
    const { rank, post } = this.props;

    return (
      <div className="post">
        <div className="rank">{rank}</div>
        <img src={post.images && post.images[0].link} alt={post.title} className="thumbnail" />
        <div className="summary">
          <div className="title"><Link to={'/@' + getPostKey(post)}>{post.title}</Link></div>
          <div className="tagline">{post.tagline}</div>
          <div className="stats"><b>{post.active_votes.length}</b> votes and <b>{post.children}</b> comments</div>
        </div>
        <div className="vote-section">
          <VoteButton post={post} type="post" layout="list" />
        </div>
      </div>
    )
  }
}