import React, {Component, PropTypes} from 'react';
import Main from '../containers/Main';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from '../config';
import { asyncConnect } from 'redux-connect';

class Model extends Component {
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
        <Helmet {...config.app.head} title="Build RESTful API within 5 min" />
        <Main models={models} open={open} context="models" modelName={name} app={app} children={children} lang={lang}/>
      </div>
    );
  }
}

Model.propTypes = {
  children: PropTypes.object.isRequired,
  models: PropTypes.array,
  open: PropTypes.bool,
  params: PropTypes.object.isRequired,
};

const connected = connect(
  (state) => ({
    models: state.models.data,
    open: state.page.open
  }),
  {}
)(Model);

const asynced = asyncConnect([{
  promise: ({helpers: {fetcher}, params}) => {
    return fetcher.models.load({
      app: params.app
    });
  }
}])(connected);

export default asynced;
