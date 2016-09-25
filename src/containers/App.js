import React, {Component, PropTypes} from 'react';
import ApiClient from 'promise-apiclient';
import uris from '../uris';
import Fetcher from 'redux-fetch-dispatcher';
import { connect } from 'react-redux';

@connect(
  state => state,
  dispatch => ({
    dispatch: (...args) => dispatch(...args)
  })
)
export default class App extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired,
    router: PropTypes.object,
    children: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  static childContextTypes = {
    fetcher: PropTypes.object.isRequired
  };

  getChildContext() {
    const req = this.props.router ? this.props.router.req : undefined;
    return {
      fetcher: new Fetcher({
        urls: uris.resources,
        dispatch: this.props.dispatch,
        client: new ApiClient(req ? {
          cookie: req.get('cookie'),
          origin: uris.base,
          referer: uris.base
        } : undefined)
      })
    };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
