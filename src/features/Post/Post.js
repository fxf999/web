import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import steemconnect from 'sc2-sdk';

import { Spin, Button } from 'antd';

// import AvatarSteemit from 'components/AvatarSteemit';
// import Author from 'components/Author';
import CommentItem from 'features/Comment/CommentItem';
import { getCommentsFromPostBegin } from 'features/Comment/actions/getCommentsFromPost';
import {
  selectCommentsChild,
  selectCommentsData,
  selectCommentsIsLoading
} from 'features/Comment/selectors';
import { selectIsConnected } from 'features/User/selectors';
import { selectCurrentComments, selectCurrentPost } from './selectors';
import { getPostBegin, setCurrentPost } from './actions/getPost';
import PostView from './components/PostView';
import PostFooter from './components/PostFooter';

class Post extends Component {
  static propTypes = {
    getPost: PropTypes.func.isRequired,
    setCurrentPost: PropTypes.func.isRequired,
    getCommentsFromPost: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    post: PropTypes.object,
    commentsData: PropTypes.object.isRequired,
    commentsChild: PropTypes.object.isRequired,
    currentComments: PropTypes.object,
    commentsIsLoading: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match: { params : { username, permlink }} } = this.props;
    this.props.getPost(username, permlink);

    this.props.getCommentsFromPost('steemhunt', username, permlink);
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.currentComments) && nextProps.commentsIsLoading === false) {
      const { match: { params : { topic, username, permlink }}} = nextProps;
      // this.props.getCommentsFromPost(topic, username, permlink);
    }

    const { match: { params : { username, permlink }} } = this.props;
    const nextAuthor = nextProps.match.params.username;
    const nextPermlink = nextProps.match.params.permlink;
    if (username !== nextAuthor || permlink !== nextPermlink) {
      this.props.getPost(nextAuthor, nextPermlink);
    }
  }

  componentWillUnmount() {
    this.props.setCurrentPost(undefined);
  }

  render() {
    const { post, currentComments, commentsData, commentsChild, commentsIsLoading, isConnected } = this.props;

    if (isEmpty(post)) {
      return null;
    }

    console.log('=====================------', currentComments);
    let comments = [];
    if (!isEmpty(currentComments)) {
      comments = currentComments.list.map(commentId => {
        return (
          <CommentItem
            key={commentId}
            comment={commentsData[commentId]}
            commentsData={commentsData}
            commentsChild={commentsChild}
          />
        )
      });
    }

    return (
      <div className="post-container">
        <Helmet>
          <title>{post.title}</title>
        </Helmet>

        <PostView post={post} />
        {/* <PostFooter post={post} /> */}

        {!isConnected && (
          <div className="post-signup">
            <p>You need a Steem account to join the discussion</p>
            <Button type="primary" href="https://steemit.com/pick_account" target="_blank">
              Sign up now
            </Button>
            <a href={steemconnect.getLoginURL()} className="signin-link">Already have a Steem account?</a>
          </div>
        )}

        // TODO FIX COMMENT

        <div className="comments">
          <Spin spinning={commentsIsLoading}>
            {comments}
          </Spin>
        </div>
      </div>
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
  getPost: (username, permlink) => dispatch(getPostBegin(username, permlink)),
  setCurrentPost: post => dispatch(setCurrentPost(post)),
  getCommentsFromPost: (category, username, permlink) => dispatch(getCommentsFromPostBegin(category, username, permlink)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
