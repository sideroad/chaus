import React from 'react';
import {Route, IndexRoute} from 'react-router';
import uris from './uris';
import {
    Container,
    Apps,
    Model,
    Data,
    ModelHome,
    DataHome,
    Attributes,
    NotFound,
    Records,
    Config
  } from 'containers';

export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path={uris.apps.apps} component={Container}>
      <IndexRoute component={Apps} />
      <Route path={uris.apps.models} component={Model} >
        <IndexRoute component={ModelHome} />
        <Route path={uris.apps.model} component={Attributes} />
      </Route>
      <Route path={uris.apps.data} component={Data} >
        <IndexRoute component={DataHome} />
        <Route path={uris.apps.records} component={Records} />
      </Route>
      <Route path={uris.apps.configs} component={Config} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
