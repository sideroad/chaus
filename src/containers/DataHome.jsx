import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { stringify } from 'koiki';

import Card from '../components/Card';
import uris from '../uris';

const styles = require('../css/data-home.less');

const DataHome = props =>
  <div>
    <h1 className={styles.lead}>Data</h1>
    <Card
      lead={{
        start: 'Click + to create Resource on sidebar',
        create: ''
      }}
      items={
        props.models.map(model =>
          ({
            ...model,
            url: stringify(uris.pages.records, {
              name: model.name,
              lang: props.lang,
              app: props.app,
            })
          })
        )
      }
    />
  </div>;

DataHome.propTypes = {
  models: PropTypes.array.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  lang: PropTypes.string.isRequired,
  app: PropTypes.string.isRequired,
};

const connected = connect(
  (state, ownProps) => ({
    models: state.models.data,
    open: state.page.open,
    lang: ownProps.params.lang,
    app: ownProps.params.app,
  }),
  {}
)(DataHome);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher }, params }) =>
    fetcher.models.load({
      app: params.app
    })
}])(connected);

export default asynced;
