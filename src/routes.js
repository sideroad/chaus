import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {
    Apps,
    Model,
    Data,
    ModelHome,
    DataHome,
    Attributes,
    NotFound,
    Records,
  } from 'containers';

export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/apps">
      <IndexRoute component={Apps} />
      <Route path="/apps/:app/models" component={Model} >
        <IndexRoute component={ModelHome} />
        <Route path="/apps/:app/models/:name" component={Attributes} />
      </Route>
      <Route path="/apps/:app/data" component={Data} >
        <IndexRoute component={DataHome} />
        <Route path="/apps/:app/data/:name" component={Records} />
      </Route>
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
