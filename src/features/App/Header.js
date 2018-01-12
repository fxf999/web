import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import steemconnect from 'sc2-sdk';

import { Icon, Button } from 'antd';

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

  constructor() {
    super();

    this.state = {
      filter: {
        post: 1,
        category: "videos",
      },
      dropdownMenu: {
        open: false,
      },
      collapseOpen: false,
    }
  }

  handleCloseDropdownMenu = () => {
    this.setState({
      dropdownMenu: {
        open: false,
      }
    });
  };

  handleControlCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };

  handleShowDropdownMenu = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      dropdownMenu: {
        open: true,
        anchorEl: event.currentTarget,
      }
    })
  };

  render() {
    const { me, myAccount } = this.props;
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
            <AvatarSteemit name={me} votingPower={myAccount.voting_power} />
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
