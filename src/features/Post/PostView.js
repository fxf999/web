import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Button, Carousel, Icon, Timeline, Tag } from 'antd';

import { selectDraft } from './selectors';

class PostView extends Component {
  static propTypes = {
    post: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tagline: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      images: PropTypes.arrayOf(PropTypes.object).isRequired,
      username: PropTypes.string,
      beneficiaries: PropTypes.arrayOf(PropTypes.shape({
        account: PropTypes.string.isRequired,
        weight: PropTypes.number.isRequired,
      })).isRequired
    }).isRequired
  };

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
    const beneficiaries = post.beneficiaries.map((b, index) => {
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
              {post.username && <li>Hunter</li>}
              {beneficiaries.length > 0 && <li>Makers</li>}
            </ul>

            <Timeline>
              {post.username && <Timeline.Item>@{post.username}</Timeline.Item>}
              {beneficiaries}
            </Timeline>
          </div>

          <div className="vote-container">
            <Button type="primary" className="vote-button">
              <Icon type="up" />
              UPVOTE
            </Button>
          </div>

          <div className="tags">
            {tags}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = () => createStructuredSelector({
  post: selectDraft()
});

export default connect(mapStateToProps)(PostView);
