import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getPostKey } from '../utils/postKey';
import VoteButton from 'features/Vote/VoteButton';

const PostItem = ({ rank, post }) => {
  return (
    <div className="post">
      <div className="rank">{rank}</div>
      <img src={post.images[0].link} alt={post.title} className="thumbnail" />
      <div className="summary">
        <div className="title"><Link to={getPostKey(post)}>{post.title}</Link></div>
        <div className="tagline">{post.tagline}</div>
        <div className="stats"><b>{post.active_votes.length}</b> votes and <b>{post.comment_count}</b> comments</div>
      </div>
      <div className="vote-section">
        <VoteButton post={post} type="post" />
      </div>
    </div>
  )
};

PostItem.propTypes = {
  rank: PropTypes.number.isRequired,
  post: PropTypes.object.isRequired,
};

export default PostItem;
