import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import last from 'lodash/last';
import PostList from 'features/Post/PostList';
import InfiniteList from 'components/InfiniteList';
import { selectIsLoading } from 'features/Post/selectors';

class HuntedList extends Component {
  constructor() {
    super();
    this.state = {
      daysAgoArray: [0, 1],
    };
  }

  addMorePostList = () => {
    const maxPage = Math.max(...this.state.daysAgoArray);
    this.setState({
      daysAgoArray: this.state.daysAgoArray.concat([maxPage + 1]),
    });
  };

  render() {
    const { daysAgoArray } = this.state;

    const genesis = (new Date('2018-02-16')).getTime();
    const oldest = Date.now() - last(daysAgoArray) * 86400000;
    const hasMore = oldest > genesis;

    return (
      <InfiniteList
        list={daysAgoArray}
        hasMore={hasMore}
        isLoading={this.props.isLoading}
        loadMoreCb={this.addMorePostList}
        itemMappingCb={daysAgo => <PostList key={daysAgo} daysAgo={daysAgo} />}
      />
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  isLoading: selectIsLoading(),
});

export default connect(mapStateToProps, null)(HuntedList);
