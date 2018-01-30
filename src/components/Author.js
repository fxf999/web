import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Author = ({ name }) => {
  return (
    <Link to={`/@${name}`} className="author">@{name}</Link>
  )
};

Author.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Author;
