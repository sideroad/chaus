/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import createStore from './create';
import ApiClient from 'promise-apiclient';
import {Provider} from 'react-redux';
import { ReduxAsyncConnect } from 'redux-connect';
import getRoutes from './routes';
import Fetcher from 'redux-fetch-dispatcher';
import uris from './uris';
import 'react-fastclick';

const client = new ApiClient();
const history = useScroll(() => browserHistory)();
const dest = document.getElementById('content');
const store = createStore(history, window.__data);
const fetcher = new Fetcher({
  dispatch: store.dispatch,
  client,
  urls: uris.resources
});

const component = (
  <Router render={(props) =>
        <ReduxAsyncConnect {...props} helpers={{fetcher}} filter={item => !item.deferred} />
      } history={history}>
    {getRoutes(store)}
  </Router>
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}
