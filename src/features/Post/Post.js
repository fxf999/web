import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import steemconnect from 'sc2-sdk';

import { List, Spin, Button } from 'antd';

import ContentPayoutAndVotes from 'components/ContentPayoutAndVotes';
import CommentItem from 'features/Comment/CommentItem';
import { getCommentsFromPostBegin } from 'features/Comment/actions/getCommentsFromPost';
import {
  selectCommentsChild,
  selectCommentsData,
  selectCommentsIsLoading
} from 'features/Comment/selectors';
import { displayContentNbComments } from 'utils/helpers/steemitHelpers';
import { selectIsConnected } from 'features/User/selectors';
import { selectCurrentComments, selectCurrentPost } from './selectors';
import { getPostBegin, setCurrentPost } from './actions/getPost';
import PostView from './components/PostView';
import CommentReplyForm from 'features/Comment/CommentReplyForm';

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

    return (
      <div className="post-container">
        <Helmet>
          <title>{post.title}</title>
        </Helmet>

        <PostView post={post} />

        <div className="comments">
          <hr />

          <h3>
            {displayContentNbComments(post)} comments
            <span className="separator">&middot;</span>
            <ContentPayoutAndVotes content={post} />
          </h3>

          {!isConnected && (
            <div className="post-signup">
              <p>You need a Steem account to join the discussion</p>
              <Button type="primary" href="https://steemit.com/pick_account" target="_blank">
                Sign up now
              </Button>
              <a href={steemconnect.getLoginURL()} className="signin-link">Already have a Steem account?</a>
            </div>
          )}

          { /* TODO: only if connected */}
          <CommentReplyForm content={post} closeForm={null} />

          {currentComments && (
            <List
              loading={commentsIsLoading}
              itemLayout="horizontal"
              dataSource={currentComments.list}
              renderItem={commentId => (
                <CommentItem
                  key={commentId}
                  comment={commentsData[commentId]}
                  commentsData={commentsData}
                  commentsChild={commentsChild}
                />
              )}
            />
          )}
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
