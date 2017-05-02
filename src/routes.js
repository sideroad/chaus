import React from 'react';
import {Route, IndexRoute} from 'react-router';
import uris from './uris';
import config from './config';
import { set } from './reducers/user';
import { get } from './helpers/auth';

import Apps from './containers/Apps';
import Model from './containers/Model';
import ModelHome from './containers/ModelHome';
import ModelAttributes from './containers/ModelAttributes';
import Data from './containers/Data';
import DataHome from './containers/DataHome';
import DataRecords from './containers/DataRecords';
import Config from './containers/Config';
import NotFound from './containers/NotFound';

export default (store, cookie) => {
  /**
   * Please keep routes in alphabetical order
   */
  const checkAuth = (nextState, replace, cb) => {
    const isLogin = store.getState().user &&
                     store.getState().user.item &&
                     store.getState().user.item.id;
    if (isLogin) {
      cb();
    } else {
      get(`${config.global.base}/auth`, cookie)
         .then(
           // login user
           (res) => {
             store.dispatch(set({
               id: res.id,
               token: res.token
             }));
             cb();
           },
           () => {
             cb();
           }
         );
    }
  };
  const login = (nextState, replace, cb) => {
    checkAuth(nextState, replace, () => {
      const isLogin = store.getState().user &&
                      store.getState().user.item &&
                      store.getState().user.item.id;
      if (isLogin) {
        cb();
      } else {
        cookie.set('redirect', nextState.location.pathname, {
          path: '/'
        });
        if (__SERVER__) {
          replace('/auth/github');
        } else {
          location.href = `${config.global.base}/auth/github`;
        }
        cb();
      }
    });
  };
  return (
    <Route path={uris.pages.root} >
      <IndexRoute component={Apps} onEnter={checkAuth} />
      <Route path={uris.pages.models} component={Model} onEnter={login} >
        <IndexRoute component={ModelHome} />
        <Route path={uris.pages.model} component={ModelAttributes} />
      </Route>
      <Route path={uris.pages.data} component={Data} onEnter={login} >
        <IndexRoute component={DataHome} />
        <Route path={uris.pages.records} component={DataRecords} />
      </Route>
      <Route path={uris.pages.configs} component={Config} onEnter={login} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
