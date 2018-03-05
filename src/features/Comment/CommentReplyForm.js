import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input } from 'antd';
import { replyBegin } from './actions/reply';
import { selectIsCommentPublishing, selectHasCommentSucceeded } from './selectors';
import { scrollTo } from 'utils/scroller';

class CommentReplyForm extends Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
    closeForm: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      body: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasCommentSucceeded &&
      this.form &&
      this.props.hasCommentSucceeded !== nextProps.hasCommentSucceeded) {
      this.form.textAreaRef.value = '';
      this.form.resizeTextarea();

      const leftPanel = document.getElementById('panel-left');
      scrollTo(leftPanel, leftPanel.offsetHeight, 800);
    }
  }

  onChange = e => this.setState({ body: e.target.value });

  reply = () => {
    this.props.reply(this.state.body);
    this.props.closeForm && this.props.closeForm();
  };

  render() {
    const { closeForm } = this.props;

    return (
      <div className="reply-form">
        <Input.TextArea
          placeholder="Say something..."
          onChange={this.onChange}
          ref={node => this.form = node}
          autosize />
        <div className="actions">
          { closeForm  && (
            <Button shape="circle" onClick={closeForm} icon="close" size="small" className="close-button"></Button>
          )}
          <Button type="primary" onClick={this.reply} loading={this.props.isCommentPublishing}>Post</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  hasCommentSucceeded: selectHasCommentSucceeded(),
  isCommentPublishing: selectIsCommentPublishing(),
});

const mapDispatchToProps = (dispatch, props) => ({
  reply: body => dispatch(replyBegin(props.content, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentReplyForm);