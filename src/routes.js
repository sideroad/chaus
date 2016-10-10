import React from 'react';
import {Route, IndexRoute} from 'react-router';
import uris from './uris';
import {
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
    <Route path={uris.pages.root} >
      <IndexRoute component={Apps} />
      <Route path={uris.pages.models} component={Model} >
        <IndexRoute component={ModelHome} />
        <Route path={uris.pages.model} component={ModelAttributes} />
      </Route>
      <Route path={uris.pages.data} component={Data} >
        <IndexRoute component={DataHome} />
        <Route path={uris.pages.records} component={DataRecords} />
      </Route>
      <Route path={uris.pages.configs} component={Config} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
