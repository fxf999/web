import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Button } from 'antd';

// import AvatarSteemit from 'components/AvatarSteemit';
// import Author from 'components/Author';
import InfiniteList from 'components/InfiniteList';
import CommentItem from 'features/Comment/CommentItem';
import { getCommentsFromPostBegin } from 'features/Comment/actions/getCommentsFromPost';
import {
  selectCommentsChild,
  selectCommentsData,
  selectCommentsIsLoading
} from 'features/Comment/selectors';
import { selectIsConnected } from 'features/User/selectors';
import { selectCurrentComments, selectCurrentPost } from './selectors';
import { getPostBegin, setCurrentPostId } from './actions/getPost';
import PostView from './components/PostView';
import PostFooter from './components/PostFooter';

class Post extends Component {
  static defaultProps = {
    location: {
      state: undefined,
    }
  };

  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        postId: PropTypes.number,
      }),
    }).isRequired,
    getPost: PropTypes.func.isRequired,
    setCurrentPostId: PropTypes.func.isRequired,
    getCommentsFromPost: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    post: PropTypes.object,
    commentsData: PropTypes.object.isRequired,
    commentsChild: PropTypes.object.isRequired,
    currentComments: PropTypes.object,
    commentsIsLoading: PropTypes.bool.isRequired,
  };

  constructor() {
    super();
    this.state = {
      nbCommentsDisplayed: 10,
    };
  }

  componentDidMount() {
    const { match: { params : { author, permlink }} } = this.props;
    this.props.getPost(author, permlink);
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.currentComments) && nextProps.commentsIsLoading === false) {
      const { match: { params : { topic, author, permlink }}} = nextProps;
      this.props.getCommentsFromPost(topic, author, permlink);
    }

    const { match: { params : { author, permlink }} } = this.props;
    const nextAuthor = nextProps.match.params.author;
    const nextPermlink = nextProps.match.params.permlink;
    if (author !== nextAuthor || permlink !== nextPermlink) {
      this.props.getPost(nextAuthor, nextPermlink);
    }
  }

  componentWillUnmount() {
    this.props.setCurrentPostId(undefined);
  }

  addMoreComments = () => {
    this.setState({
      nbCommentsDisplayed: this.state.nbCommentsDisplayed + 10,
    });
  };

  render() {
    const { post, currentComments, commentsData, commentsChild, commentsIsLoading, isConnected } = this.props;
    const { nbCommentsDisplayed } = this.state;
    let listComments, listCommentsDisplayed = [];
    if (!isEmpty(currentComments)) {
      listComments = currentComments.list;
      listCommentsDisplayed = listComments.slice(0, nbCommentsDisplayed);
    }
    return (
      <article>
        {!isEmpty(post) && (
          <div className="post-cointainer">
            <Helmet>
              <title>{post.title}</title>
            </Helmet>

            <PostView post={post} />
            <PostFooter post={post} />

            {!isConnected && (
              <div className="post-signup">
                <p>Authors get paid when people like you upvote their post.</p>
                <p>Join our amazing community to comment and reward others.</p>
                <Link to="/signup">
                  <Button
                    type="primary"
                    style={{ background: "#368dd2" }}
                  >
                    Sign up now to receive FREE STEEM
                  </Button>
                </Link>
              </div>
            )}
            <div className="comments">
              <InfiniteList
                list={listCommentsDisplayed}
                hasMore={listComments && listComments.length > nbCommentsDisplayed}
                isLoading={commentsIsLoading}
                loadMoreCb={this.addMoreComments}
                itemMappingCb={commentId =>
                  <CommentItem
                    key={commentId}
                    comment={commentsData[commentId]}
                    commentsData={commentsData}
                    commentsChild={commentsChild}
                  />}
              />
            </div>
          </div>
        )}
      </article>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  post: selectCurrentPost(),
  commentsData: selectCommentsData(),
  commentsChild: selectCommentsChild(),
  currentComments: selectCurrentComments(),
  commentsIsLoading: selectCommentsIsLoading(),
  isConnected: selectIsConnected(),
});

const mapDispatchToProps = dispatch => ({
  getPost: (author, permlink) => dispatch(getPostBegin(author, permlink)),
  setCurrentPostId: id => dispatch(setCurrentPostId(id)),
  getCommentsFromPost: (category, author, permlink) => dispatch(getCommentsFromPostBegin(category, author, permlink)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
