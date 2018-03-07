import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getPostPath } from '../utils';
import VoteButton from 'features/Vote/VoteButton';
import Author from 'components/Author';

export default class PostItem extends Component {
  static propTypes = {
    rank: PropTypes.number.isRequired,
    post: PropTypes.object.isRequired,
  };

  render() {
    const { rank, post } = this.props;
    const activeVotes = post.active_votes.filter(v => v.percent !== 0);

    return (
      <div className="post">
        <div className="rank">{rank}</div>
        <Link to={getPostPath(post)}>
          <img src={post.images && post.images[0].link} alt={post.title} className="thumbnail"/>
        </Link>
        <div className="summary">
          <div className="title"><Link to={getPostPath(post)}>{post.title}</Link></div>
          <div className="tagline">{post.tagline}</div>
          <div className="stats">
            <Author name={post.author} />
            <span className="spacer">&middot;</span>
            <b>{activeVotes.length}</b> votes and <b>{post.children}</b> comments
          </div>
        </div>
        <div className="vote-section">
          <VoteButton post={post} type="post" layout="list" />
        </div>
      </div>
    )
  }
}