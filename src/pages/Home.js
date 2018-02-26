import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import imgLogo from 'assets/images/logo-main-white@2x.png';
import imgCat from 'assets/images/img-about-cat@2x.png';
import imgSteemLogo from 'assets/images/logo-steem-white@2x.png';
import imgProductHunt from 'assets/images/img-producthunt@2x.png';
import imgBackground from 'assets/images/img-front-bg@2x.png';
import { scrollTo } from 'utils/scroller';

export default class Home extends Component {
  scrollNext = (e) => {
    e.stopPropagation();
    const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    console.log(vh);
    scrollTo(document.getElementById('panel-left'), vh + 2, 800);
  };

  render() {
    return (
      <div>
        <div className="home-page full-page primary-gradient">
          <div className="center-content">
            <img src={imgLogo} alt="Steemhunt Logo" className="main-logo" />
            <h1>Steemhunt</h1>
            <p>A Steem Fueled Product Hunt</p>

            <Button size="large" ghost={true} className="round-border padded-button" onClick={this.scrollNext}>Learn More</Button>
          </div>
        </div>

        <div className="padded-page">
          <div className="split-page">
            <h2>
              Discover<br/>
              Cool Products and<br/>
              Get Rewards by<br/>
              STEEM
            </h2>
            <p>
              You can surface new products, upvote and comment on them,
              and most importantly, you will be rewarded with STEEM tokens for your contribution.
            </p>
            <a href="https://steem.io" target="_blank" rel="noopener noreferrer">What is STEEM? <Icon type="right-circle-o" /></a>
          </div>
          <img src={imgCat} alt="Steemhunt" className="side-image cat" />
        </div>

        <div className="padded-page primary-gradient page-3">
          <h2>Dig More, Earn More<br/>How?</h2>

          <div class="howto">
            <div class="circle">
              <Icon type="search" />
            </div>
            <h4>DISCOVER</h4>
            <p>
              There are millions of cool products like web, app, hardware or anything that people may not see yet.
              You can be a hunter who digs out and introduces them to the Steemhunt community.
            </p>
          </div>
          <Icon type="down" className="splitter" />
          <div class="howto">
            <div class="circle">
              <Icon type="edit" />
            </div>
            <h4>ACKNOWLEDGE MAKERS</h4>
            <p>
              You can assign makers of the product with shares of rewards that will be generated from the post you make.
            </p>
          </div>
          <Icon type="down" className="splitter" />
          <div class="howto">
            <div class="circle">
              <img src={imgSteemLogo} alt="Steem Logo" className="steem-logo" />
            </div>
            <h4>COMPETE AND EARN STEEM</h4>
            <p>
              Whenever people make actions on your post such as upvotes and comments, the rewards will be accumulated by STEEM, and pay out in 14 days in the proportion of you assigned. More the post earn Steem value, the rank of the day will be arisen.
            </p>
          </div>
          <a href="https://steem.io" target="_blank" rel="noopener noreferrer" className="bottom-link">What is STEEM? <Icon type="right-circle-o" /></a>
        </div>

        <div className="padded-page">
          <div className="split-page">
            <h2>
              Product Hunt<br/>
              is Great, But…
            </h2>
            <p>
              Millions of dedicated users make Product Hunt a great place where you can discover new ideas everyday.
              However, similar to other communities such as Reddit or Facebook,
              all the rewards go to the platform itself instead of the dedicated community members.
            </p>
            <a href="https://www.producthunt.com/team/product-hunt" target="_blank" rel="noopener noreferrer">What is Product Hunt? <Icon type="right-circle-o" /></a>
          </div>
          <img src={imgProductHunt} alt="Steemhunt" className="side-image producthunt" />
        </div>

        <div className="padded-page primary-gradient page-last">
          <div className="left-container">
            <img src={imgLogo} alt="Steemhunt Logo" className="main-logo" />
            <h2>
              Destination for<br/>
              Product-Enthusiasts
            </h2>

            <Link to="/post" className="post-button round-border padded-button">
              MAKE NEW POST
            </Link>
          </div>

          <img src={imgBackground} alt="Steemhunt Preview" className="bg-image" />
        </div>
      </div>
    );
  }
}
