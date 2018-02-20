import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Carousel, Icon, Timeline, Tag, Tooltip } from 'antd';

import IconFacebook from 'react-icons/lib/fa/facebook-square';
import IconTwitter from 'react-icons/lib/fa/twitter-square';
import IconLinkedIn from 'react-icons/lib/fa/linkedin-square';

import VoteButton from 'features/Vote/VoteButton';
import ResteemButton from './ResteemButton';

export default class PostView extends Component {
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
  };

  // TODO: Handle share icon evnets

  render() {
    const { post } = this.props;
    const images = post.images.map((image, index) => {
      return (
        <div key={index}><img src={image.link} alt={image.name} /></div>
      );
    });
    const autoplay = images.length > 1 ? true : false;
    const tags = post.tags.map((tag, index) => {
      return (
        <Tag key={index}><a href={`https://steemit.com/trending/${tag}`} target="_blank" rel="noopener noreferrer">{tag}</a></Tag>
      );
    });
    const beneficiaries = post.beneficiaries && post.beneficiaries.map((b, index) => {
      return (
        <Timeline.Item key={index}>@{b.account} ({b.weight / 100}%)</Timeline.Item>
      );
    })

    return (
      <div className="post-view">
        <div className="top-container primary-gradient">
          <span className="featured-date round-border">#1 on Jan 1st, 2018</span>
          <h1>{post.title}</h1>
          <h2>{post.tagline}</h2>
          <Button type="primary" htmlType="submit" className="round-border inversed-color padded-button">CHECK IT OUT</Button>
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          {post.images.length > 0 ? (
            <Carousel className="carousel" autoplay={autoplay}>{images}</Carousel>
          ) : (
            <Carousel className="carousel" autoplay>
              <div><Icon type="camera-o" /></div>
              <div><Icon type="video-camera" /></div>
            </Carousel>
          )}

          <div className="timeline-container">
            <ul className="left">
              {post.author && <li>Hunter</li>}
              {beneficiaries && beneficiaries.length > 0 && <li>Makers</li>}
            </ul>

            <Timeline>
              {post.author && <Timeline.Item>@{post.author}</Timeline.Item>}
              {beneficiaries}
            </Timeline>
          </div>

          <div className="vote-container">
            <VoteButton post={post} type="post" layout="detail-page" />
            <ResteemButton post={post} />
            <div className="social-shares">
              <Tooltip title="Share on Facebook">
                <span className="share-icon"><IconFacebook /></span>
              </Tooltip>
              <Tooltip title="Share on Twitter">
                <span className="share-icon"><IconTwitter /></span>
              </Tooltip>
              <Tooltip title="Share on LinkedIn">
                <span className="share-icon"><IconLinkedIn /></span>
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
