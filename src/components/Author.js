import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Author = ({ name }) => {
  return (
    <div className="author">
      <Link to={`/@${name}`}>@{name}</Link>
    </div>
  )
};

Author.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Author;
