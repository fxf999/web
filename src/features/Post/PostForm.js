import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import { Form, Row, Col, Input, InputNumber, Tooltip, Icon, Button, Upload, Modal } from 'antd';

import { selectIsPublishing } from './selectors';
import { selectMe } from 'features/User/selectors';

import { publishContentBegin } from './actions/publishContent';
import { updatePreview } from './actions/updatePreview';
import { initialState } from './actions';

import { splitTags } from 'utils/sanitizer';
import api from 'utils/api';

const FormItem = Form.Item;
let currentBeneficiaryId = 0;

class PostForm extends Component {
  // TODO: Save draft into localstorage

  static propTypes = {
    me: PropTypes.string.isRequired,
    updatePreview: PropTypes.func.isRequired,
    publishContent: PropTypes.func.isRequired,
    isPublishing: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      previewImageVisible: false,
      previewImage: '',
      fileList: [],
      beneficiariesValid: true,
      shouldRecalculateBeneficiary: false,
      draft: {},
    };
    this.beneficiaryInput = {};
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.publishContent(this.state.draft);
  }

  // MARK: - Beneficiaries
  // TODO: Refactor into a component

  onBeneficiariesChanged = () => {
    // TODO: FIXME: HACK:
    // value is one step behind because maybe the inputNumberRef doesn't set synchronously
    setTimeout(() => {
      const { form } = this.props;
      const beneficiaryIds = form.getFieldValue('beneficiaryIds');

      let weightSum = 0;
      let beneficiaries = [];
      for (const i of beneficiaryIds) {
        const account = this.beneficiaryInput[i]['accountInput'].input.value;
        const weight = this.beneficiaryInput[i]['weightInput'].inputNumberRef.getCurrentValidValue();
        beneficiaries.push({ account: account, weight: weight * 100 });
        weightSum += weight;
      }
      this.updateField('beneficiaries', beneficiaries);

      if (weightSum > 90 || weightSum <= 0) {
        this.setState({ beneficiariesValid: false });
      } else {
        this.setState({ beneficiariesValid: true });
      }
    }, 50);

    this.setState({ shouldRecalculateBeneficiary: false });
  }

  removeBeneficiary = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const beneficiaryIds = form.getFieldValue('beneficiaryIds');

    // can use data-binding to set
    form.setFieldsValue({
      beneficiaryIds: beneficiaryIds.filter(key => key !== k),
    });

    this.setState({ shouldRecalculateBeneficiary: true });
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

    this.setState({ shouldRecalculateBeneficiary: true });
  }

  componentDidUpdate() {
    if (this.state.shouldRecalculateBeneficiary) {
      this.onBeneficiariesChanged();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.me !== nextProps.me) {
      this.updateField('username', nextProps.me);
    }
  }

  // MARK: - Custom Validators

  checkTags = (_, value, callback) => {
    const form = this.props.form;
    const tags = splitTags(form.getFieldValue('tags'));

    if (tags.length > 4) {
      callback('Please use only 4 tags');
    } else {
      this.handleTagsChange(tags);
      callback();
    }
  }

  checkUrl = (_, value, callback) => {
    if (value.length === 0) {
      return callback();
    }

    api.get('/posts/exists.json', { url: value }).then((res) => {
      if (res.result === 'OK') {
        this.updateField('url', value);
        callback();
      } else if (res.result === 'ALREADY_EXISTS') { // TODO: Go to the product page link
        callback('The product link already exists.');
      } else {
        callback('The input is not valid URL.');
      }
    }).catch(msg => {
      callback('Service is temporarily unavailbe, Please try again later.');
    });
  }

  // MARK: - Handle uploads

  handleImagePreviewCancel = () => this.setState({ previewVisible: false })
  handleImagePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // MARK: - Handle live updates

  updateField = (field, value) => {
    this.setState({ draft: update(this.state.draft, { $merge: { [field]: value } }) }, () => this.props.updatePreview(this.state.draft));
  }
  handleTitleChange = (e) => this.updateField('title', e.target.value || initialState.draft.title)
  handleTaglineChange = (e) => this.updateField('tagline', e.target.value || initialState.draft.tagline)
  handleImageChange = ({ fileList }) => {
    const images = fileList.map(f => f.response && f.response.data &&
      {
        name: f.name,
        link: f.response.data.link,
        width: f.response.data.width,
        height: f.response.data.height,
        type: f.response.data.type,
        id: f.response.data.id,
        deletehash: f.response.data.deletehash,
      }
    );
    this.setState({ fileList });
    this.updateField('images', images.filter(x => !!x));
  }
  handleTagsChange = (tags) => this.updateField('tags', tags)

  render() {
    const { getFieldDecorator, getFieldValue, getFieldProps } = this.props.form;
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
      this.beneficiaryInput[k] = { accountInput: null, weightInput: null };

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
              <Input
                addonBefore="@"
                placeholder="steemhunt"
                className="beneficiaries"
                ref={el => { this.beneficiaryInput[k]['accountInput'] = el; }}
                onChange={this.onBeneficiariesChanged}
                maxLength="16"
              />
            </Col>
            <Col span={10}>
              <InputNumber
                defaultValue={20}
                min={1}
                max={90}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                onChange={this.onBeneficiariesChanged}
                ref={el => { this.beneficiaryInput[k]['weightInput'] = el; }}
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
            validateTrigger: ['onBlur'],
            rules: [
              { required: true, message: 'Product link cannot be empty', whitespace: true },
              { validator: this.checkUrl },
            ],
          })(
            <Input placeholder="https://steemit.com" />
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
              placeholder="A social media where everyone gets paid for participation"
              maxLength="60"
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
              rules: [{ required: true, message: 'You must upload at least one image' }],
            })(
              <Upload.Dragger name="image"
                action="https://api.imgur.com/3/image"
                headers={{
                  'Authorization': 'Client-ID 32355fe756394b2',
                  'Cache-Control': null,
                  'X-Requested-With': null
                }}
                listType="picture-card"
                fileList={this.state.fileList}
                onPreview={this.handleImagePreview}
                onChange={this.handleImageChange}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-hint">Click or drag image(s) to this area to upload</p>
              </Upload.Dragger>
            )}
          </div>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleImagePreviewCancel}>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Tags"
        >
          {getFieldDecorator('tags', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{ validator: this.checkTags }],
          })(
            <Input
              placeholder="Up to 4 tags, separated by a space"
            />
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
  me: selectMe(),
  isPublishing: selectIsPublishing(),
});

const mapDispatchToProps = dispatch => ({
  updatePreview: post => dispatch(updatePreview(post)),
  publishContent: post => dispatch(publishContentBegin(post)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPostForm);

