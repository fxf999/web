import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Button, Input } from 'antd';

import { selectMe } from 'features/User/selectors';
import { replyBegin } from './actions/reply';

class CommentReplyForm extends Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
    closeForm: PropTypes.func,
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
    this.props.closeForm && this.props.closeForm();
  };

  render() {
    const { closeForm, me } = this.props;
    const { body } = this.state;
    return (
      <div className="reply-form">
        <Input.TextArea placeholder="Say something..." autosize />
        <div className="actions">
          { closeForm  && (
            <Button shape="circle" onClick={closeForm} icon="close" size="small" className="close-button"></Button>
          )}
          <Button type="primary" onClick={this.reply}>Post</Button>
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