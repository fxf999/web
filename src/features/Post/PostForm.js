import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectIsPublishing } from './selectors';
import update from 'immutability-helper';

import { Form, Row, Col, Input, InputNumber, Tooltip, Icon, Button, Upload } from 'antd';

import { publishContentBegin } from './actions/publishContent';
import { updatePreview } from './actions/updatePreview';
import { initialState } from './actions';

import { splitTags } from 'utils/sanitizer';
import './PostForm.css';

const FormItem = Form.Item;
let currentBeneficiaryId = 0;

class PostForm extends Component {

  // TODO: Refactor Beneficiaries component

  constructor(props) {
    super(props);

    this.state = {
      beneficiariesValid: true,
      shouldRecalculate: false,
      draft: {},
    };
    this.beneficiaryRewardsInput = {};
  }

  onBeneficiariesChanged = () => {
    // TODO: FIXME: HACK:
    // value is one step behind because maybe the inputNumberRef doesn't set synchronously
    setTimeout(() => {
      const { form } = this.props;
      const beneficiaryIds = form.getFieldValue('beneficiaryIds');

      const beneficiarySum = beneficiaryIds.reduce((sum, k) => {
        return sum + this.beneficiaryRewardsInput[k].inputNumberRef.getCurrentValidValue();
      }, 0);

      if (beneficiarySum > 90 || beneficiarySum <= 0) {
        this.setState({ beneficiariesValid: false });
      } else {
        this.setState({ beneficiariesValid: true });
      }
    }, 50);

    this.setState({ shouldRecalculate: false });
  }

  removeBeneficiary = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const beneficiaryIds = form.getFieldValue('beneficiaryIds');

    // can use data-binding to set
    form.setFieldsValue({
      beneficiaryIds: beneficiaryIds.filter(key => key !== k),
    });

    this.setState({ shouldRecalculate: true });
  }

  addBeneficiary = () => {
    currentBeneficiaryId++;
    const { form } = this.props;
    // can use data-binding to get
    const beneficiaryIds = form.getFieldValue('beneficiaryIds');
    const nextIds = beneficiaryIds.concat(currentBeneficiaryId);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      beneficiaryIds: nextIds,
    });

    this.setState({ shouldRecalculate: true });
  }

  checkTags = (_, value, callback) => {
    const form = this.props.form;
    const tags = splitTags(form.getFieldValue('tags'));

    if (tags.length > 4) {
      callback('Please use only 4 tags');
    } else {
      callback();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  componentDidUpdate() {
    if (this.state.shouldRecalculate) {
      this.onBeneficiariesChanged();
    }
  }

  // MARK: - Handle live updates
  updateField = (field, value) => {
    this.state.draft[field] = value;
    this.props.updatePreview(this.state.draft);
  }
  handleTitleChange = (e) => this.updateField('title', e.target.value || initialState.draft.title)
  handleTaglineChange = (e) => this.updateField('tagline', e.target.value || initialState.draft.tagline)


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        lg: { span: 24 },
        xl: { span: 5 },
      },
      wrapperCol: {
        lg: { span: 24 },
        xl: { span: 19 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        lg: { span: 24, offset: 0 },
        xl: { span: 19, offset: 5 },
      },
    };
    getFieldDecorator('beneficiaryIds', { initialValue: [] });
    const beneficiaryIds = getFieldValue('beneficiaryIds');
    const beneficiaries = beneficiaryIds.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? (
            <span>
              Contributors&nbsp;
              <Tooltip title="You can add other beneficiaries from your post">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          ) : ''}
          required={false}
          key={k}
        >
          <Row gutter={8}>
            <Col span={14}>
              {getFieldDecorator(`beneficiaries-${k}`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: "Please input Steem account of the contributor or delete this field.",
                }],
              })(
                <Input addonBefore="@" placeholder="steemhunt" className="beneficiaries" />
              )}
            </Col>
            <Col span={10}>
              <InputNumber
                ref={(el) => {this.beneficiaryRewardsInput[k] = el }}
                defaultValue={20}
                min={1}
                max={90}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                onChange={this.onBeneficiariesChanged}
              />
              <Icon
                className="delete-button"
                type="minus-circle-o"
                disabled={beneficiaryIds.length === 1}
                onClick={() => this.removeBeneficiary(k)}
              />
            </Col>
          </Row>
        </FormItem>
      );
    });

    return (
      <Form onSubmit={this.handleSubmit} className="post-form">
        <FormItem
          {...formItemLayout}
          label="Product Link"
        >
          {getFieldDecorator('url', {
            rules: [{ required: true, message: 'Product link cannot be empty', whitespace: true }],
          })(
            <Input name="post[url]" placeholder="https://steemit.com" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Name (Title)"
        >
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Name cannot be empty', whitespace: true }],
          })(
            <Input
              name="post[title]"
              placeholder="Steemit"
              onChange={this.handleTitleChange} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Short Description"
          help="Describe what you’re posting in 60 characters or less."
        >
          {getFieldDecorator('tagline', {
            rules: [ { required: true, message: 'Short description cannot be empty', whitespace: true } ],
          })(
            <Input
              name="post[tagline]"
              placeholder="A social media where everyone gets paid for participation"
              maxlength={60}
              onChange={this.handleTaglineChange}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Images"
        >
          <div className="dropbox">
            {getFieldDecorator('images', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [{ required: true, message: 'You must upload at least one image' }],
            })(
              <Upload.Dragger name="image"
                action="https://api.imgur.com/3/image"
                headers={{
                  'Authorization': 'Client-ID 32355fe756394b2',
                  'Cache-Control': null,
                  'X-Requested-With': null
                }}
                listType="picture-card">
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-hint">Click or drag image(s) to this area to upload</p>
              </Upload.Dragger>
            )}
          </div>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Tags"
        >
          {getFieldDecorator('tags', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{ validator: this.checkTags }],
          })(
            <Input name="post[tags]" placeholder="Up to 4 tags, separated by a space" />
          )}
        </FormItem>

        {beneficiaries}

        <FormItem {...formItemLayoutWithOutLabel}>
          {!this.state.beneficiariesValid && (
              <div className="ant-form-item-control has-error">
                <p className="ant-form-explain">Sum or reward values must be less than or equal to 90%</p>
              </div>
            )
          }
          <Button type="dashed" onClick={this.addBeneficiary}>
            <Icon type="plus" /> Add makers or contributors
          </Button>
          <p className="text-small top-margin">10% of author's rewards will be used to pay for the operation of Steemhunt.</p>
        </FormItem>

        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit" className="pull-right round-border primary-gradient padded-button">POST NOW</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedPostForm = Form.create()(PostForm);

const mapStateToProps = (state, props) => createStructuredSelector({
  isPublishing: selectIsPublishing(),
});

const mapDispatchToProps = dispatch => ({
  updatePreview: post => dispatch(updatePreview(post)),
  publishContent: content => dispatch(publishContentBegin(content)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPostForm);

