import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import steemconnect from 'sc2-sdk';

import { Menu, Popover, Icon, Button } from 'antd';

import { selectMe, selectMyAccount } from 'features/User/selectors';
import { logoutBegin } from 'features/User/actions/logout';

import logo from 'assets/images/logo-nav-pink@2x.png'
import AvatarSteemit from 'components/AvatarSteemit';

class Header extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    myAccount: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  render() {
    const { me, myAccount } = this.props;

    let menu;
    if(me) {
      menu = (
        <Menu theme="dark">
          <Menu.Item key="0">
            <Link to={`/@${me}`}>
              <Icon type="user" /> MY PROFILE
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <span onClick={this.props.logout}>
              <Icon type="poweroff" /> LOGOUT
            </span>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <header>
        <Link to="/">
          <img src={logo} alt="logo" className="nav-logo"/>
        </Link>

        <div className="pull-right">
          <Link to="/post" className="header-button">
            <Icon type="plus-circle-o" style={{ fontSize: 24, color: '#666' }} />
          </Link>

          {me ? (
            <Popover content={menu} trigger="click" placement="bottomRight">
              <span className="ant-dropdown-link" role="button">
                <AvatarSteemit name={me} votingPower={myAccount.voting_power} />
              </span>
            </Popover>
          ) : (
            <Button type="primary" href={steemconnect.getLoginURL()}>Connect</Button>
          )}
        </div>
      </header>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  me: selectMe(),
  myAccount: selectMyAccount(),
});

const mapDispatchToProps = (dispatch, props) => ({
  logout: () => dispatch(logoutBegin()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
