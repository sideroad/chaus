import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import { connect } from 'react-redux';
import * as modelsActions from 'redux/modules/models';
import {isLoaded, load} from 'redux/modules/models';
import {initializeWithKey} from 'redux-form';
import Helmet from 'react-helmet';
import config from '../config';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}, params}) => {
    if (!isLoaded(getState(), params.app)) {
      return dispatch(load(params.app));
    }
  }
}])
@connect(
  (state, props) => ({
    models: state.models[props.params.app].data,
    open: state.page.open
  }),
  {
    ...modelsActions,
    initializeWithKey
  }
)
export default class Model extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    models: PropTypes.array,
    open: PropTypes.bool,
    params: PropTypes.object.isRequired,
  }

  render() {
    const {
      children,
      models,
      open
    } = this.props;

    const {
      name,
      app,
      lang
    } = this.props.params;

    const styles = require('../css/customize.less');
    return (
      <div className={styles['cm-container']} >
        <Helmet {...config.app.head} title="Build RESTful API within 5 min" />
        <Main models={models} open={open} context="models" modelName={name} app={app} children={children} lang={lang}/>
      </div>
    );
  }
}
