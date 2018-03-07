import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Button, Carousel, Icon, Timeline, Tag, Tooltip, Modal } from 'antd';
import IconFacebook from 'react-icons/lib/fa/facebook-square';
import IconTwitter from 'react-icons/lib/fa/twitter-square';
import IconLinkedIn from 'react-icons/lib/fa/linkedin-square';
import { Link } from 'react-router-dom';
import { getPostPath } from '../utils';
import VoteButton from 'features/Vote/VoteButton';
import ResteemButton from './ResteemButton';
import Author from 'components/Author';
import { selectMe } from 'features/User/selectors';
import { getHtml } from 'components/Body';
import { shortFormat } from 'utils/date';

class PostView extends Component {
  static propTypes = {
    post: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tagline: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      images: PropTypes.arrayOf(PropTypes.object).isRequired,
      author: PropTypes.string,
      active_votes: PropTypes.arrayOf(PropTypes.object).isRequired,
      payout_value: PropTypes.number.isRequired,
      children: PropTypes.number.isRequired,
      beneficiaries: PropTypes.arrayOf(PropTypes.shape({
        account: PropTypes.string.isRequired,
        weight: PropTypes.number.isRequired,
      })),
    }).isRequired,
    author: PropTypes.string,
    permlink: PropTypes.string,
    me: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      previewImage: '',
      previewVisible: false,
    };
  }

  // MARK: - Handle image preview

  hideModal = () => this.setState({ previewVisible: false });
  showModal = (e) => {
    this.setState({
      previewImage: e.target.src,
      previewVisible: true,
    });
  };

  render() {
    const { me, post } = this.props;
    const images = post.images.map((image, index) => {
      return (
        <div key={index}>
          <img alt={image.name} src={image.link} onClick={this.showModal} />
        </div>
      );
    });
    const tags = post.tags.map((tag, index) => {
      // TODO: To steemhunt tags
      return (
        <Tag key={index}><a href={`https://steemit.com/trending/${tag}`} target="_blank" rel="noopener noreferrer">{tag}</a></Tag>
      );
    });
    const beneficiaries = post.beneficiaries && post.beneficiaries.map((b, index) => {
      return (
        <Timeline.Item key={index}><Author name={b.account} /> ({b.weight / 100}%)</Timeline.Item>
      );
    })

    const shouldShowEdit = window.location.pathname !== '/post' && me === post.author;

    return (
      <div className="post-view diagonal-split-view">
        <div className="top-container primary-gradient">
          <span className="featured-date round-border" data-id={post.id}>Featured on {shortFormat(post.created_at)}</span>
          { shouldShowEdit &&
            <Link to={`${getPostPath(post)}/edit`}>
              <Button icon="edit" size="small" className="edit-button" ghost>Edit</Button>
            </Link>
          }
          <h1>{post.title}</h1>
          <h2>{post.tagline}</h2>
          <Button
            href={post.url}
            type="primary"
            htmlType="submit"
            className="round-border inversed-color padded-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            CHECK IT OUT
          </Button>
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          {post.images.length === 0 &&
            <Carousel className="carousel" effect="fade">
              <div><Icon type="camera-o" /></div>
            </Carousel>
          }
          {post.images.length === 1 &&
            <Carousel
              className="carousel"
              autoplay={false}
              effect="fade"
            >
              {images}
            </Carousel>
          }
          {post.images.length > 1 &&
            <Carousel
              className="carousel"
              autoplay={true}
              effect="scrollx"
            >
              {images}
            </Carousel>
          }

          <div className="description">
            {post.description && getHtml(post.description)}
          </div>

          <div className="timeline-container">
            <ul className="left">
              {post.author && <li>Hunter</li>}
              {beneficiaries && beneficiaries.length > 0 && <li>Makers</li>}
            </ul>

            <Timeline>
              {post.author && <Timeline.Item><Author name={post.author} /></Timeline.Item>}
              {beneficiaries}
            </Timeline>
          </div>

          <div className="vote-container">
            <VoteButton post={post} type="post" layout="detail-page" />

            { me && me !== post.author &&
              <ResteemButton post={post} />
            }

            <div className="social-shares">
              <Tooltip title="Share on Facebook">
                <a
                  href={'https://www.facebook.com/sharer.php?u=' + encodeURI(window.location.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-icon"
                >
                  <IconFacebook />
                </a>
              </Tooltip>
              <Tooltip title="Share on Twitter">
                <a href={'https://twitter.com/intent/tweet?url=' + encodeURI(window.location.href) +
                    '&text=' + encodeURI(post.title) +
                    '&hashtags=steemhunt,steem'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-icon"
                >
                  <IconTwitter />
                </a>
              </Tooltip>
              <Tooltip title="Share on LinkedIn">
                <a
                  href={'https://www.linkedin.com/shareArticle?mini=true' +
                    '&url=' + encodeURI(window.location.href) +
                    '&title=' + encodeURI(post.title) +
                    '&summary=' + encodeURI(post.tagline) +
                    '&source=Steemhunt'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-icon"
                >
                  <IconLinkedIn />
                </a>
              </Tooltip>
            </div>
          </div>

          <div className="tags">
            {tags}
          </div>
        </div>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.hideModal} width="50%">
          <img alt="Preview" src={this.state.previewImage} width="100%" />
        </Modal>
      </div>
    )
  }
}


const mapStateToProps = createStructuredSelector({
  me: selectMe(),
});

export default connect(mapStateToProps)(PostView);
