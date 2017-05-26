import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import Main from '../containers/Main';
import config from '../config';

const Data = props =>
  <div>
    <Helmet {...config.app.head} title="Build RESTful API within 5 min" />
    <Main
      models={props.models}
      open={props.open}
      context="data"
      modelName={props.name}
      app={props.app}
      lang={props.lang}
    >
      {props.children}
    </Main>
  </div>;


Data.propTypes = {
  children: PropTypes.object.isRequired,
  models: PropTypes.array,
  open: PropTypes.bool,
  name: PropTypes.string,
  app: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
};

Data.defaultProps = {
  name: '',
  open: false,
  models: [],
};

const connected = connect(
  (state, ownProps) => ({
    models: state.models.data,
    open: state.page.open,
    name: ownProps.params.name,
    app: ownProps.params.app,
    lang: ownProps.params.lang,
  }),
  {}
)(Data);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher }, params }) => {
    const promises = [];
    promises.push(fetcher.models.load({
      app: params.app
    }));
    promises.push(fetcher.configs.load({
      app: params.app
    }));
    promises.push(fetcher.attributes.load({
      app: params.app
    }));
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
