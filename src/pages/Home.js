import React from 'react';
import { Button } from 'antd';
import logo from 'assets/images/logo-main-white@2x.png'

export default function Home(props) {
  return (
    <div className="home-page primary-gradient">
      <div className="center-content">
        <img src={logo} alt="Steemhunt logo" className="main-logo" />
        <h1>Steemhunt</h1>
        <p>A Steem Fueled Product Hunt</p>

        <Button size="large" ghost={true} className="round-border padded-button">Learn More</Button>
      </div>
    </div>
  );
}
