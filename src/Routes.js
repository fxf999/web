import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import asyncComponent from 'asyncComponent';
import { getToken } from './utils/token';
import { getMeBegin } from './features/User/actions/getMe';
import { selectMe } from './features/User/selectors';
import Header from './features/App/Header';
import Post from './features/Post/Post';
import PostForm from './features/Post/PostForm';
import Draft from './features/Post/Draft';

const Home = asyncComponent(() => import('./pages/Home'));
const HuntedList = asyncComponent(() => import('./pages/HuntedList'));
const Profile = asyncComponent(() => import('./features/User/Profile'));

class Left extends Component {
  render() {
    return (
      <div className="panel-left">
        {this.props.location.search && <Redirect to="/" />}
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/@:username/:permlink" exact component={Post} />
          <Route path="/post" exact component={Draft} />
          <Route path="/@:username" component={Profile} />
          <Route path="/:tag" exact component={Home} />
        </Switch>
      </div>
    );
  }
}

class Right extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    getMe: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = {
      scrollTop: 0
    };
  }

  componentDidMount() {
    if (this.props.location.search) {
      const { access_token } = queryString.parse(this.props.location.search);
      if (access_token) {
        this.props.getMe(access_token);
      }
    }
    const accessToken = getToken();
    if (accessToken) {
      this.props.getMe(accessToken);
    }

    this.container.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => { // TODO: Different from handleScroll() {} ??
    this.setState({ scrollTop: this.container.scrollTop });
  };

  render() {
    return (
      <div className="panel-right" ref={(ref) => this.container = ref}>
        <Header scrollTop={this.state.scrollTop}/>
        <Switch>
          <Route path="/" exact component={HuntedList} />
          <Route path="/post" exact component={PostForm} />
          <Route path="/@:username" component={HuntedList} />
          <Route path="/@:username/:permlink" exact component={HuntedList} />
          <Route path="/:tag" exact component={HuntedList} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  me: selectMe(),
});

const mapDispatchToProps = dispatch => ({
  getMe: token => dispatch(getMeBegin(token)),
});

export const RoutesLeft = withRouter(connect(mapStateToProps, mapDispatchToProps)(Left));
export const RoutesRight = withRouter(connect(mapStateToProps, mapDispatchToProps)(Right));
