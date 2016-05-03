import React from 'react';
import {Route, IndexRoute} from 'react-router';
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
    <Route path="/:lang/apps" component={Container}>
      <IndexRoute component={Apps} />
      <Route path="/:lang/apps/:app/models" component={Model} >
        <IndexRoute component={ModelHome} />
        <Route path="/:lang/apps/:app/models/:name" component={Attributes} />
      </Route>
      <Route path="/:lang/apps/:app/data" component={Data} >
        <IndexRoute component={DataHome} />
        <Route path="/:lang/apps/:app/data/:name" component={Records} />
      </Route>
      <Route path="/:lang/apps/:app/config" component={Config} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
