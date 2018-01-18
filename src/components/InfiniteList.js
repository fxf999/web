import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import isEmpty from 'lodash/isEmpty';

import { Spin } from 'antd';

export default class InfiniteList extends PureComponent {
  static defaultProps = {
    isLoading: false,
  };

  static propTypes = {
    list: PropTypes.array.isRequired,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    initLoad: PropTypes.func,
    loadMoreCb: PropTypes.func.isRequired,
    itemMappingCb: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // INITIAL DATA LOADING IF PROVIDED
    if (this.props.initLoad) {
      const { list, hasMore } = this.props;
      if ((hasMore === true || hasMore === undefined) && isEmpty(list)) {
        this.props.initLoad();
      }
    }
  }

  loadMore = () => {
    const { isLoading, hasMore } = this.props;
    if (isLoading === false && hasMore === true) {
      this.props.loadMoreCb();
    }
  };

  render() {
    const { list, hasMore, itemMappingCb } = this.props;
    const items = list.map(itemMappingCb);

    if (list.length === 0) {
      return null;
    }

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadMore}
        hasMore={hasMore}
        loader={<Spin className="center-loading" key={0} />}
        useWindow={false}
      >
        {items}
      </InfiniteScroll>
    );
  }
}
