import React, { Component } from 'react';
import { Icon } from 'antd';
import './PostFeedEmbed.css';

export default class PostFeedEmbed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIframe: false,
    };
  }

  handleThumbClick = (e) => {
    e.stopPropagation();
    this.setState({ showIframe: true });
  };

  renderThumbFirst(thumb) {
    return (
      <a className="postFeedEmbed" onClick={this.handleThumbClick}>
        <div className="postFeedEmbed-icon">
          <Icon type="play-circle-o" style={{ fontSize: '60px' }}/>
        </div>
        <img src={thumb} alt="" />
      </a>
    );
  }

  renderWithIframe(embed) {
    return (
      <div className="PostFeedCard__thumbs" dangerouslySetInnerHTML={{ __html: embed }} />
    );
  }

  render() {
    const { embed } = this.props;

    if (embed.provider_name === 'YouTube' && !this.state.showIframe) {
      return this.renderThumbFirst(embed.thumbnail);
    } else if (embed.embed) {
      return this.renderWithIframe(embed.embed);
    }
    return <div />;
  }
}
