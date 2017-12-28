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
    const tags = post.tags.map((tag, index) => {
      return (
        <Tag key={index}><a href={`https://steemit.com/trending/${tag}`} target="_blank" rel="noopener noreferrer">{tag}</a></Tag>
      );
    });
    const beneficiaries = post.beneficiaries.map((b, index) => {
      return (
        <Timeline.Item key={index}>@{b.account}({b.weight / 100}%)</Timeline.Item>
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
              <Timeline.Item>@{post.hunter}</Timeline.Item>
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
