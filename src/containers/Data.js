import React, {Component, PropTypes} from 'react';
import {Header, Sidebar, Footer, ModalLoading} from 'components';
import { connect } from 'react-redux';
import * as modelsActions from 'redux/modules/models';
import * as pageActions from 'redux/modules/page';
import {isLoaded, load} from 'redux/modules/models';
import {initializeWithKey} from 'redux-form';
import Helmet from 'react-helmet';
import config from '../config';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(load());
    }
  }
}])
@connect(
  state => ({
    models: state.models.data,
    open: state.page.open
  }),
  {
    ...modelsActions,
    closeSidebar: pageActions.closeSidebar,
    initializeWithKey
  }
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    models: PropTypes.array,
    open: PropTypes.bool,
    params: PropTypes.object.isRequired,
    closeSidebar: PropTypes.func.isRequired
  }

  handleClick = () => {
    this.props.closeSidebar();
  }

  render() {
    const {
      children,
      models,
      open
    } = this.props;

    const {
      name
    } = this.props.params;

    const styles = require('../css/customize.less');
    return (
      <div className={styles['cm-container']} >
        <Helmet {...config.app.head} title="Manipulate API data" />
        <Sidebar models={models} open={open} context="data" name={name} />
        <div className={styles['cm-main'] + ' ' + (open ? styles['cm-open-main'] : '')} >
          <Header />
          <div className={'uk-grid uk-container ' + styles['cm-grid']} >
            {children}
          </div>
          <Footer />
          <ModalLoading />
        </div>
      </div>
    );
  }
}
