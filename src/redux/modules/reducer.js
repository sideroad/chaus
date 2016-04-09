import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import {reducer as form} from 'redux-form';
import models from './models';
import attributes from './attributes';
import relations from './relations';
import records from './records';
import page from './page';
import apps from './apps';
import logger from './logger';

export default combineReducers({
  routing: routeReducer,
  reduxAsyncConnect,
  form,
  models,
  attributes,
  relations,
  records,
  page,
  apps,
  logger
});
