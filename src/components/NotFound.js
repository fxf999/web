import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import imgLogo from 'assets/images/logo-main-white@2x.png';

const NotFound = () => {
  return (
    <div className="not-found-page full-page primary-gradient">
      <div className="center-content">
        <img src={imgLogo} alt="Steemhunt Logo" className="main-logo" />
        <h1>The page you were looking for doesn't exist.</h1>
        <p>You may have mistyped the address or the page may have moved.</p>
        <Link to="/" className="round-border padded-button">
          <Button size="large" ghost={true} className="round-border padded-button">Take Me Home</Button>
        </Link>
      </div>
    </div>
  )
};

export default NotFound;
