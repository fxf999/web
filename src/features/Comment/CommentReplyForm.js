import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Button } from 'antd';

import AvatarSteemit from 'components/AvatarSteemit';
import { selectMe } from 'features/User/selectors';
import { replyBegin } from './actions/reply';

class CommentReplyForm extends Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
    closeForm: PropTypes.func.isRequired,
    me: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      body: '',
    }
  }

  onChange = (evt, val) => {
    this.setState({ body: val });
  };

  reply = () => {
    this.props.reply(this.state.body);
    this.props.closeForm();
  };

  render() {
    const { closeForm, me } = this.props;
    const { body } = this.state;
    return (
      <div className="CommentItem">
        <div className="CommentComponent__avatar">
          <AvatarSteemit name={me} />
        </div>
        <div className="CommentComponent__detail">
          <textarea
            name="comment-reply"
            value={body}
            placeholder="Reply"
            onChange={this.onChange}
          />
          <div>
            <Button type="primary" onClick={this.reply}>Post</Button>
            <Button onClick={closeForm}>Close</Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  me: selectMe(),
});

const mapDispatchToProps = (dispatch, props) => ({
  reply: body => dispatch(replyBegin(props.content, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentReplyForm);