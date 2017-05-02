import React, {Component, PropTypes} from 'react';
import autoBind from 'react-autobind';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import Main from '../containers/Main';
import * as pageActions from '../reducers/page';
import config from '../config';

class Data extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleClick() {
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

Data.propTypes = {
  children: PropTypes.object.isRequired,
  models: PropTypes.array,
  open: PropTypes.bool,
  params: PropTypes.object.isRequired,
  closeSidebar: PropTypes.func.isRequired
};

const connected = connect(
  (state) => ({
    models: state.models.data,
    open: state.page.open
  }),
  {
    closeSidebar: pageActions.closeSidebar
  }
)(Data);

const asynced = asyncConnect([{
  promise: ({helpers: {fetcher}, params}) => {
    return fetcher.models.load({
      app: params.app
    });
  }
}])(connected);

export default asynced;
