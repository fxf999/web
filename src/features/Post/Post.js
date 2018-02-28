import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import steemconnect from 'sc2-sdk';
import { List, Button } from 'antd';
import ContentPayoutAndVotes from 'components/ContentPayoutAndVotes';
import CommentItem from 'features/Comment/CommentItem';
import { getCommentsFromPostBegin } from 'features/Comment/actions/getCommentsFromPost';
import {
  selectCommentsChild,
  selectCommentsData,
  selectCommentsIsLoading
} from 'features/Comment/selectors';
import { getCommentsCount } from './utils';
import { selectIsConnected } from 'features/User/selectors';
import { selectCurrentComments, selectCurrentPost } from './selectors';
import { getPostBegin, setCurrentPostKey } from './actions/getPost';
import PostView from './components/PostView';
import CommentReplyForm from 'features/Comment/CommentReplyForm';

class Post extends Component {
  static propTypes = {
    getPost: PropTypes.func.isRequired,
    setCurrentPostKey: PropTypes.func.isRequired,
    getCommentsFromPost: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    post: PropTypes.object,
    commentsData: PropTypes.object.isRequired,
    commentsChild: PropTypes.object.isRequired,
    currentComments: PropTypes.object,
    commentsIsLoading: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match: { params : { author, permlink }} } = this.props;
    this.props.getPost(author, permlink);
    this.props.getCommentsFromPost('steemhunt', author, permlink);
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params : { author, permlink }} } = this.props;
    const nextAuthor = nextProps.match.params.author;
    const nextPermlink = nextProps.match.params.permlink;

    if (author !== nextAuthor || permlink !== nextPermlink) {
      this.props.getPost(nextAuthor, nextPermlink);

      if (nextProps.commentsIsLoading === false) {
        this.props.getCommentsFromPost('steemhunt', nextAuthor, nextPermlink);
      }
    }
  }

  componentWillUnmount() {
    this.props.setCurrentPostKey(null);
  }

  render() {
    const { post, currentComments, commentsData, commentsChild, commentsIsLoading, isConnected } = this.props;

    if (isEmpty(post)) {
      return null;
    }

    return (
      <div className="post-container">
        <Helmet>
          <title>{post.title} - Steemhunt</title>
        </Helmet>

        <PostView post={post} />

        <div className="comments">
          <hr />

          <h3>
            {currentComments && (
              <span>
                {getCommentsCount(post, currentComments.list, commentsChild)} comments
                <span className="separator">&middot;</span>
              </span>
            )}
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

          {isConnected && (
            <CommentReplyForm content={post} closeForm={null} />
          )}

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
  getPost: (author, permlink) => dispatch(getPostBegin(author, permlink)),
  setCurrentPostKey: key => dispatch(setCurrentPostKey(key)),
  getCommentsFromPost: (category, author, permlink) => dispatch(getCommentsFromPostBegin(category, author, permlink)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
