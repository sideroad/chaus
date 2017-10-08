import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { auth } from 'koiki';
import uris from './uris';
import config from './config';
import { set as setUser } from './reducers/user';

import Root from './containers/Root';
import Home from './containers/Home';
import Apps from './containers/Apps';
import Resource from './containers/Resource';
import ResourceHome from './containers/ResourceHome';
import ResourceAttributes from './containers/ResourceAttributes';
import Data from './containers/Data';
import DataHome from './containers/DataHome';
import DataRecords from './containers/DataRecords';
import Config from './containers/Config';
import NotFound from './containers/NotFound';

export default (store, cookie) =>
  <Route
    path={uris.pages.root}
    component={Root}
  >
    <IndexRoute
      component={Home}
      onEnter={auth.check(store, cookie, config.global.base, setUser)}
    />
    <Route
      path={uris.pages.apps}
      onEnter={auth.login(store, cookie, config.global.base, 'github', setUser)}
    >
      <IndexRoute component={Apps} />
      <Route path={uris.pages.models} component={Resource} >
        <IndexRoute component={ResourceHome} />
        <Route path={uris.pages.model} component={ResourceAttributes} />
      </Route>
      <Route path={uris.pages.data} component={Data} >
        <IndexRoute component={DataHome} />
        <Route path={uris.pages.records} component={DataRecords} />
      </Route>
      <Route path={uris.pages.configs} component={Config} />
    </Route>
    { /* Catch all route */ }
    <Route path="*" component={NotFound} status={404} />
  </Route>;
