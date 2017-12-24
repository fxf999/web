import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Button, Carousel, Icon, Timeline, Tag } from 'antd';

import { selectDraft } from './selectors';

class PostView extends Component {
  static propTypes = {
    post: PropTypes.object,
  };

  render() {
    const { post } = this.props;
    const images = post.images.map((image, index) => {
      return (
        <div><img src={image.link} key={index} alt={image.name} /></div>
      );
    });
    const autoplay = images.length > 1 ? true : false;

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
          { post.images.length > 0 ? (
            <Carousel className="carousel" autoplay={autoplay}>{images}</Carousel>
          ) : (
            <Carousel className="carousel" autoplay>
              <div><Icon type="camera-o" /></div>
              <div><Icon type="video-camera" /></div>
            </Carousel>
          )}

          <div className="timeline-container">
            <ul className="left">
              <li>Hunter</li>
              <li>Makers</li>
            </ul>

            <Timeline>
              <Timeline.Item>@steemhunt</Timeline.Item>
              <Timeline.Item>@tabris</Timeline.Item>
              <Timeline.Item>@project7</Timeline.Item>
            </Timeline>
          </div>

          <div className="vote-container">
            <Button type="primary" className="vote-button">
              <Icon type="up" />
              UPVOTE
            </Button>
          </div>

          <div className="tags">
            <Tag><a href="https://steemit.com/trending/steemdev" target="_blank" rel="noopener noreferrer">steemdev</a></Tag>
            <Tag><a href="https://steemit.com/trending/steem" target="_blank" rel="noopener noreferrer">steem</a></Tag>
            <Tag><a href="https://steemit.com/trending/dev" target="_blank" rel="noopener noreferrer">dev</a></Tag>
            <Tag><a href="https://steemit.com/trending/crypto" target="_blank" rel="noopener noreferrer">crypto</a></Tag>
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
