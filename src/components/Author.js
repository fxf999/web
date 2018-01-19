import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Author = ({ name, reputation }) => {
  return (
    <div className="author">
      <Link to={`/@${name}`}>{name}</Link>
      {reputation && ({reputation})}
    </div>
  )
};

Author.propTypes = {
  name: PropTypes.string.isRequired,
  reputation: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

export default Author;
