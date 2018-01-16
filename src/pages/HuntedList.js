import React, { Component } from 'react';

import PostList from 'features/Post/PostList';
import InfiniteList from 'components/InfiniteList';

export default class HuntedList extends Component {
  constructor() {
    super();
    this.state = {
      daysAgoArray: [0, 1, 2],
      isLoading: false,
    };
  }

  addMorePostList = () => {
    console.log('=========== load more=============');
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
    const hasMore = daysAgoArray.length < 30;

    console.log('--------------------', daysAgoArray);

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
