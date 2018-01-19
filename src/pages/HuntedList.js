import React, { Component } from 'react';
import last from 'lodash/last';

import PostList from 'features/Post/PostList';
import InfiniteList from 'components/InfiniteList';

export default class HuntedList extends Component {
  constructor() {
    super();
    this.state = {
      daysAgoArray: [0, 1],
      isLoading: false,
    };
  }

  addMorePostList = () => {
    console.log('----------> load more');
    const maxPage = Math.max(...this.state.daysAgoArray);
    this.setState({
      daysAgoArray: this.state.daysAgoArray.concat([maxPage + 1]),
      isLoading: true,
    }, () => {
      this.setState({ isLoading: false });
    });
  };

  render() {
    const { daysAgoArray, isLoading } = this.state;
    // TODO: when there're 10 day of consequence empty postlist

    const genesis = 1514797200000; // 2018-01-18
    const oldest = Date.now() - last(daysAgoArray) * 86400000;
    const hasMore = oldest > genesis;

    console.log('----------> List days: ', daysAgoArray, genesis, oldest, hasMore);

    return (
      <InfiniteList
        list={daysAgoArray}
        hasMore={hasMore}
        isLoading={isLoading}
        loadMoreCb={this.addMorePostList}
        itemMappingCb={daysAgo => <PostList key={daysAgo} daysAgo={daysAgo} />}
      />
    );
  }
}
