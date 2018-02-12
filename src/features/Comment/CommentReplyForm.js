import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input } from 'antd';
import { replyBegin } from './actions/reply';

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

  onChange = e => this.setState({ body: e.target.value });

  reply = () => {
    this.props.reply(this.state.body);
    this.props.closeForm && this.props.closeForm();
  };

  render() {
    const { closeForm } = this.props;

    return (
      <div className="reply-form">
        <Input.TextArea placeholder="Say something..." onChange={this.onChange} autosize />
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

const mapDispatchToProps = (dispatch, props) => ({
  reply: body => dispatch(replyBegin(props.content, body)),
});

export default connect(null, mapDispatchToProps)(CommentReplyForm);