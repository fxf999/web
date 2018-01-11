import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import VoteButton from 'features/Vote/VoteButton';

const Post = ({ rank, post }) => {
  const thumbnailStyle = {
    backgroundImage: `url(${post.images[0].link})`
  }
  return (
    <div className="post">
      <div className="rank">{rank}</div>
      <div className="thumbnail" style={thumbnailStyle}></div>
      <div className="summary">
        <div className="title">{post.title}</div>
        <div className="tagline">{post.tagline}</div>
        <div className="stats">{post.vote_count} votes and {post.comment_count} comments</div>
      </div>
      <div className="vote-button">
        <VoteButton content={post} type="post" />
      </div>
    </div>
  )
};

Post.propTypes = {
  rank: PropTypes.number.isRequired,
  post: PropTypes.object.isRequired,
};

export default Post;
