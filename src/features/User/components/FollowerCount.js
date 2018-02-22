import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectFollowersCount, selectFollowingsCount } from '../selectors';

import { getFollowerCountBegin } from '../actions/getFollowerCount';
import numeral from 'numeral';

class FollowerCount extends Component {
  static defaultProps = {
    count: undefined,
  };

  static propTypes = {
    author: PropTypes.string.isRequired,
    unit: PropTypes.oneOf(['followers', 'followings']).isRequired,
    getFollowerCount: PropTypes.func.isRequired,
    count: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf([undefined]),
    ]),
  };

  componentDidMount() {
    const { count, author } = this.props;
    if (count === undefined) {
      this.props.getFollowerCount(author);
    }
  }

  render() {
    const { count } = this.props;
    return (
      <span>
        { count > 0 ? numeral(count).format('0,0') : '...' }
      </span>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  count: props.unit === 'followers' ? selectFollowersCount(props.author) : selectFollowingsCount(props.author),
});

const mapDispatchToProps = dispatch => ({
  getFollowerCount: author => dispatch(getFollowerCountBegin(author)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowerCount);
