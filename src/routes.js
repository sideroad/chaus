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
    <Route path="/apps/:lang" component={Container}>
      <IndexRoute component={Apps} />
      <Route path="/apps/:lang/:app/models" component={Model} >
        <IndexRoute component={ModelHome} />
        <Route path="/apps/:lang/:app/models/:name" component={Attributes} />
      </Route>
      <Route path="/apps/:lang/:app/data" component={Data} >
        <IndexRoute component={DataHome} />
        <Route path="/apps/:lang/:app/data/:name" component={Records} />
      </Route>
      <Route path="/apps/:lang/:app/config" component={Config} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
