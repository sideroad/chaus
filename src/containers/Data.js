import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import { connect } from 'react-redux';
import * as pageActions from 'reducers/page';
import Helmet from 'react-helmet';
import config from '../config';
import { asyncConnect } from 'redux-connect';

@asyncConnect([{
  promise: ({helpers: {fetcher}, params}) => {
    return fetcher.models.load({
      app: params.app
    });
  }
}])
@connect(
  (state) => ({
    models: state.models.data,
    open: state.page.open
  }),
  {
    closeSidebar: pageActions.closeSidebar
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
      name,
      app,
      lang
    } = this.props.params;

    const styles = require('../css/customize.less');
    return (
      <div className={styles.container} >
        <Helmet {...config.app.head} title="Manipulate API data" />
        <Main models={models} open={open} context="data" modelName={name} app={app} children={children} lang={lang} />
      </div>
    );
  }
}
