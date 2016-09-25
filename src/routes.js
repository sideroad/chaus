import React from 'react';
import {Route, IndexRoute} from 'react-router';
import uris from './uris';
import {
    App,
    Apps,
    Model,
    ModelHome,
    ModelAttributes,
    Data,
    DataHome,
    DataRecords,
    Config,
    NotFound
  } from 'containers';

export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path={uris.apps.apps} component={App} >
      <IndexRoute component={Apps} />
      <Route path={uris.apps.models} component={Model} >
        <IndexRoute component={ModelHome} />
        <Route path={uris.apps.model} component={ModelAttributes} />
      </Route>
      <Route path={uris.apps.data} component={Data} >
        <IndexRoute component={DataHome} />
        <Route path={uris.apps.records} component={DataRecords} />
      </Route>
      <Route path={uris.apps.configs} component={Config} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
