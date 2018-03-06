import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getLoginURL } from 'utils/token';
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

  state = {
    menuVisible: false,
  }

  handleVisibleChange = (visible) => this.setState({ menuVisible: visible });

  render() {
    const { me, myAccount } = this.props;

    let menu;
    if(me) {
      menu = (
        <Menu theme="dark">
          <Menu.Item key="0">
            <Link to={`/@${me}`} onClick={() => this.handleVisibleChange(false)}>
              <Icon type="loading-3-quarters" /> VOTING POWER: {parseInt(myAccount.voting_power / 100)}%
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to={`/@${me}`} onClick={() => this.handleVisibleChange(false)}>
              <Icon type="user" /> MY PROFILE
            </Link>
          </Menu.Item>
          <Menu.Item key="31">
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

        {me ? (
          <div className="pull-right">
            <Link to="/about" className="header-button tablet-only">
              <Icon type="question-circle-o" />
            </Link>
            <Link to="/post" className="header-button">
              <Icon type="plus-circle-o" />
            </Link>
            <Popover
              content={menu}
              trigger="click"
              placement="bottomRight"
              visible={this.state.menuVisible}
              onVisibleChange={this.handleVisibleChange}
            >
              <span className="ant-dropdown-link" role="button">
                <AvatarSteemit name={me} votingPower={myAccount.voting_power} />
              </span>
            </Popover>
          </div>
        ) : (
          <div className="pull-right">
            <Link to="/about" className="header-button tablet-only">
              <Icon type="question-circle-o" />
            </Link>
            <a href={getLoginURL()} className="header-button">
              <Icon type="plus-circle-o" style={{ fontSize: 24, color: '#666' }} />
            </a>
            <Button type="primary" href={getLoginURL()}>Connect</Button>
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
