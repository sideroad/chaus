import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';
import {reducer as form} from 'redux-form';

import i18n from './i18n';
import models from './models';
import attributes from './attributes';
import records from './records';
import page from './page';
import apps from './apps';
import configs from './configs';
import origins from './origins';
import networks from './networks';
import logger from './logger';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  form,
  i18n,
  models,
  attributes,
  records,
  page,
  apps,
  configs,
  origins,
  networks,
  logger
});
