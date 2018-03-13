import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Form, Row, Col, Input, InputNumber, Tooltip, Icon, Button, Upload, Modal } from 'antd';
import { selectDraft, selectIsPublishing } from './selectors';
import { selectMe } from 'features/User/selectors';
import { publishContentBegin } from './actions/publishContent';
import { updateDraft, resetDraft } from './actions/updateDraft';
import { initialState } from './actions';
import { splitTags } from 'utils/sanitizer';
import { timeUntilMidnightSeoul } from 'utils/date';
import api from 'utils/api';
import { selectCurrentPost } from './selectors';
import { getPostBegin, setCurrentPostKey } from './actions/getPost';
import { sanitizeText, addReferral } from './utils';

const FormItem = Form.Item;
let currentBeneficiaryId = 0;

class PostForm extends Component {
  // TODO: Save draft into localstorage

  static propTypes = {
    me: PropTypes.string.isRequired,
    draft: PropTypes.object.isRequired,
    updateDraft: PropTypes.func.isRequired,
    resetDraft: PropTypes.func.isRequired,
    publishContent: PropTypes.func.isRequired,
    isPublishing: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      resetted: false,
      previewImageVisible: false,
      previewImage: '',
      fileList: [],
      beneficiariesValid: true,
      shouldRecalculateBeneficiary: false,
      guidelineVisible: false,
    };
    this.beneficiaryInput = {};
  }

  componentDidMount() {
    const { match: { params : { author, permlink }} } = this.props;
    if (author && permlink) {
      this.props.getPost(author, permlink);
      this.setState({ editMode: true, resetted: false });
    } else {
      this.checkAndResetDraft();
    }

    if (this.props.me) {
      this.props.updateDraft('author', this.props.me);
    }
  }

  componentWillUnmount() {
    this.checkAndResetDraft();
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params : { author, permlink }} } = this.props;
    const nextAuthor = nextProps.match.params.author;
    const nextPermlink = nextProps.match.params.permlink;

    if (nextAuthor && nextPermlink) {
      if (author !== nextAuthor || permlink !== nextPermlink) {
        this.props.getPost(nextAuthor, nextPermlink);
      }
      this.setState({ editMode: true, resetted: false });

      if (this.props.draft.permlink !== nextProps.draft.permlink) {
        this.prepareForEdit(nextProps.draft);
      }
    } else {
      this.checkAndResetDraft();
    }

    if (this.props.me !== nextProps.draft.author) {
      this.props.updateDraft('author', this.props.me);
    }
  }

  componentDidUpdate() {
    if (this.state.shouldRecalculateBeneficiary) {
      this.onBeneficiariesChanged();
    }
  }

  setGuidelineVisible(guidelineVisible) {
    this.setState({ guidelineVisible });
  }

  checkAndResetDraft = () => {
    if (!this.state.resetted) {
      this.props.setCurrentPostKey(null);
      this.props.resetDraft();
      this.setState({ resetted: true });
    }
  };

  prepareForEdit = (draft) => {
    this.props.updateDraft('permlink', draft.permlink);
    this.setState({
      fileList: draft.images.map((f, i) => f &&
        {
          uid: i,
          name: f.name,
          url:  f.link,
          status: 'done',
          id: f.id,
          type: f.type,
          link: f.link,
          deletehash: f.deletehash,
          width: f.width,
          height: f.height,
        }
      ),
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.publishContent(this.state.editMode);
  };

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
      this.props.updateDraft('beneficiaries', beneficiaries);

      if (weightSum > 90 || weightSum < 0) {
        this.setState({ beneficiariesValid: false });
      } else {
        this.setState({ beneficiariesValid: true });
      }
    }, 50);

    this.setState({ shouldRecalculateBeneficiary: false });
  };

  removeBeneficiary = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const beneficiaryIds = form.getFieldValue('beneficiaryIds');

    // can use data-binding to set
    form.setFieldsValue({
      beneficiaryIds: beneficiaryIds.filter(key => key !== k),
    });

    this.setState({ shouldRecalculateBeneficiary: true });
  };

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
  };

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
  };

  checkUrl = (_, value, callback) => {
    if (value.length === 0) {
      return callback();
    }
    value = addReferral(value);

    api.get('/posts/exists.json', { url: value }).then((res) => {
      if (res.result === 'OK') {
        this.props.updateDraft('url', value);
        callback();
      } else if (res.result === 'ALREADY_EXISTS') { // TODO: Go to the product page link
        callback('The product link already exists.');
      } else {
        callback('The input is not valid URL.');
      }
    }).catch(msg => {
      callback('Service is temporarily unavailbe, Please try again later.');
    });
  };

  // MARK: - Handle uploads

  handleImagePreviewCancel = () => this.setState({ previewVisible: false });
  handleImagePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  // MARK: - Handle live updates

  handleTitleChange = (e) => this.props.updateDraft('title', sanitizeText(e.target.value) || initialState.draft.title);
  handleTaglineChange = (e) => this.props.updateDraft('tagline', sanitizeText(e.target.value) || initialState.draft.tagline);
  handleDescriptionChange = (e) => this.props.updateDraft('description', e.target.value || initialState.draft.description);
  handleImageChange = ({ fileList }) => {
    const images = fileList.map(function(f) {
      if (f.response && f.response.data && f.response.data.link) {
        return {
          name: f.name,
          link: f.response.data.link,
          width: f.response.data.width,
          height: f.response.data.height,
          type: f.response.data.type,
          id: f.response.data.id,
          deletehash: f.response.data.deletehash,
        }
      } else if (f.name && f.link) { // Handle Edit
        return {
          name: f.name,
          link: f.link,
          width: f.width,
          height: f.height,
          type: f.type,
          id: f.id,
          deletehash: f.deletehash,
        }
      }
      return null;
    });
    this.setState({ fileList });
    this.props.updateDraft('images', images.filter(x => !!x));
  };
  handleTagsChange = (tags) => this.props.updateDraft('tags', tags);

  initialValue = (field, defaultValue = null) => initialState.draft[field] === this.props.draft[field] ? defaultValue : this.props.draft[field];

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        lg: { span: 24 },
        xl: { span: 6 },
      },
      wrapperCol: {
        lg: { span: 24 },
        xl: { span: 18 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        lg: { span: 24, offset: 0 },
        xl: { span: 18, offset: 6 },
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
                ref={node => this.beneficiaryInput[k]['accountInput'] = node}
                onChange={this.onBeneficiariesChanged}
                maxLength="16"
              />
            </Col>
            <Col span={10}>
              <InputNumber
                min={1}
                max={90}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                onChange={this.onBeneficiariesChanged}
                ref={el => { this.beneficiaryInput[k]['weightInput'] = el; }}
                defaultValue={20}
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
        <div className="guideline"><a onClick={() => this.setGuidelineVisible(true)}>Posting Guidelines</a></div>
        <Modal
          title="Posting Guidelines"
          visible={this.state.guidelineVisible}
          width={800}
          footer={null}
          onOk={() => this.setGuidelineVisible(false)}
          onCancel={() => this.setGuidelineVisible(false)}
        >
          <p>These are the areas of products Steemhunt welcomes:</p>
          <ul>
            <li>Web services</li>
            <li>Mobile apps</li>
            <li>Games</li>
            <li>API, IT solutions, bots, open sources or other types of software</li>
            <li>Tech gadgets</li>
            <li>Unique items</li>
          </ul>
          <p>Steemhunt WON’T like if you post:</p>
          <ul>
            <li>A business instead of a product. A business is larger and more vague than a product. For example, you may post a new Samsung Galaxy S9 phone - this is a product. You can’t post “Samsung” itself - this is a business.</li>
            <li>Something launched a while ago that many people already know about.</li>
            <li>Something that does not have any valid website, so users can’t make purchases or see information clearly.</li>
            <li>Using an upvoting bot service that may disrupt our daily ranking.</li>
          </ul>
          <p>Please make sure you “hunt” cool new products in the areas we mentioned above, so that we can make Steemhunt a cool ranking community. Thanks again for your support.</p>
        </Modal>
        <FormItem
          {...formItemLayout}
          label="Product Link"
        >
          {getFieldDecorator('url', {
            validateTrigger: ['onBlur'],
            initialValue: this.initialValue('url'),
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
          label="Name of Product"
        >
          {getFieldDecorator('title', {
            initialValue: this.initialValue('title'),
            rules: [{ required: true, message: 'Name cannot be empty', whitespace: true }],
          })(
            <Input
              placeholder="Steemit"
              maxLength="30"
              onChange={this.handleTitleChange} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Short Description"
          help="Describe what you’re posting in 60 characters or less."
        >
          {getFieldDecorator('tagline', {
            initialValue: this.initialValue('tagline'),
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
                multiple={true}
                accept="image/*"
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-hint">Click or drag image(s) to this area to upload</p>
              </Upload.Dragger>
            )}
          </div>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleImagePreviewCancel}>
            <img alt="Preview" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Description"
        >
          {getFieldDecorator('description', {
            initialValue: this.initialValue('description'),
          })(
            <Input.TextArea
              placeholder="Extra information, if needed"
              rows={4}
              onChange={this.handleDescriptionChange} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Tags"
        >
          {getFieldDecorator('tags', {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: this.initialValue('tags', []).join(' '),
            rules: [{ validator: this.checkTags }],
          })(
            <Input
              placeholder="Up to 4 tags, separated by a space"
            />
          )}
        </FormItem>

        {!this.state.editMode && beneficiaries}

        {!this.state.editMode &&
          <FormItem {...formItemLayoutWithOutLabel}>
            {!this.state.beneficiariesValid && (
                <div className="ant-form-item-control has-error">
                  <p className="ant-form-explain">Sum of reward values must be less than or equal to 90%</p>
                </div>
              )
            }
            <Button type="dashed" onClick={this.addBeneficiary}>
              <Icon type="plus" /> Add makers or contributors
            </Button>
            <p className="text-small top-margin">
              10% of the rewards will be used to pay for the operation of Steemhunt.<br/>
              {timeUntilMidnightSeoul()}
            </p>
          </FormItem>
        }

        <FormItem {...formItemLayoutWithOutLabel}>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-button pull-right round-border padded-button"
            loading={this.props.isPublishing}
          >
            {this.state.editMode ? 'UPDATE POST' : 'POST NOW'}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedPostForm = Form.create()(PostForm);

const mapStateToProps = () => createStructuredSelector({
  me: selectMe(),
  draft: selectDraft(),
  post: selectCurrentPost(),
  isPublishing: selectIsPublishing(),
});

const mapDispatchToProps = (dispatch, props) => ({
  getPost: (author, permlink) => dispatch(getPostBegin(author, permlink, true)),
  setCurrentPostKey: key => dispatch(setCurrentPostKey(key)),
  updateDraft: (field, value) => dispatch(updateDraft(field, value)),
  resetDraft: () => dispatch(resetDraft()),
  publishContent: (editMode) => dispatch(publishContentBegin(props, editMode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPostForm);

