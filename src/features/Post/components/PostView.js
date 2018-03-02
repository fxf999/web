import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Button, Carousel, Icon, Timeline, Tag, Tooltip } from 'antd';
import IconFacebook from 'react-icons/lib/fa/facebook-square';
import IconTwitter from 'react-icons/lib/fa/twitter-square';
import IconLinkedIn from 'react-icons/lib/fa/linkedin-square';
import VoteButton from 'features/Vote/VoteButton';
import ResteemButton from './ResteemButton';
import Author from 'components/Author';
import { selectMe } from 'features/User/selectors';
import { getHtml } from 'components/Body';

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

  // TODO: Handle share icon evnets

  render() {
    const { me, post } = this.props;
    const images = post.images.map((image, index) => {
      return (
        <div key={index}><img src={image.link} alt={image.name} /></div>
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

    return (
      <div className="post-view diagonal-split-view">
        <div className="top-container primary-gradient">
          <span className="featured-date round-border">#1 on Jan 1st, 2018</span>
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
          {post.images.length > 0 ? (
            <Carousel
              className="carousel"
              autoplay={images.length > 1 ? true : false}
              effect={images.length === 1 ? 'fade' : 'scrollx'}
            >
              {images}
            </Carousel>
          ) : (
            <Carousel className="carousel" effect="fade">
              <div><Icon type="camera-o" /></div>
            </Carousel>
          )}

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
      </div>
    )
  }
}


const mapStateToProps = createStructuredSelector({
  me: selectMe(),
});

export default connect(mapStateToProps)(PostView);
