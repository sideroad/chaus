import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {
    Admin,
    Data,
    AdminHome,
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
    <Route>
      <Route path="/admin" component={Admin} >
        <IndexRoute component={AdminHome} />
        <Route path="/admin/models/:name" component={Attributes} />
      </Route>
      <Route path="/data" component={Data} >
        <IndexRoute component={DataHome} />
        <Route path="/data/models/:name" component={Records} />
      </Route>
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
