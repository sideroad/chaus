import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import {ConfigForm} from 'components';
import { connect } from 'react-redux';
import * as configsActions from 'redux/modules/configs';
import {load as loadConfigs} from 'redux/modules/configs';
import {isLoaded, load as loadModels} from 'redux/modules/models';
import {initializeWithKey} from 'redux-form';
import Helmet from 'react-helmet';
import config from '../config';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({params, store: {dispatch, getState}}) => {
    const promises = [];
    if (!isLoaded(getState(), params.app)) {
      promises.push(dispatch(loadModels(params.app)));
    }
    promises.push(dispatch(loadConfigs(params.app)));
    return Promise.all(promises);
  }
}])
@connect(
  (state, props) => ({
    models: state.models[props.params.app].data,
    configs: state.configs.data || {},
    open: state.page.open
  }),
  {
    ...configsActions,
    initializeWithKey
  }
)
export default class Config extends Component {
  static propTypes = {
    configs: PropTypes.object,
    open: PropTypes.bool,
    models: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired
  }

  render() {
    const {
      configs,
      models,
      open
    } = this.props;

    const {
      app,
      lang
    } = this.props.params;

    const styles = require('../css/customize.less');
    return (
      <div className={styles['cm-container']} >
        <Helmet {...config.app.head} title="Configure API settings" />
        <Main models={models} open={open} context="configs" app={app} children={
          <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
            <ConfigForm initialValues={configs} lang={lang} app={app} />
          </div>
        } lang={lang}/>
      </div>
    );
  }
}
