import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { push } from 'react-router-redux';
import { stringify } from 'koiki';
import Card from '../components/Card';
import uris from '../uris';
import Graph from '../components/Graph';
import styles from '../css/model-home.less';


const ModelHome = props =>
  <div>
    <h1 className={styles.lead}>Models</h1>
    {
      props.networks ?
        <div className={styles.graph}>
          <Graph
            dot={`digraph {${props.networks}}`}
            onSelectNode={
              node =>
                props.push(stringify(uris.pages.model, {
                  lang: props.lang,
                  app: props.app,
                  name: node
                }))
            }
          />
        </div>
      :
        <Card
          lead={{
            start: 'Click + to create Model on sidebar',
            create: ''
          }}
          items={[]}
        />
    }
  </div>;

ModelHome.propTypes = {
  networks: PropTypes.string,
  push: PropTypes.func.isRequired,
  app: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
};

const connected = connect(
  (state, ownProps) => ({
    models: state.models.data,
    networks: state.networks.data,
    open: state.page.open,
    app: ownProps.params.app,
    lang: ownProps.params.lang,
  }),
  {
    push
  }
)(ModelHome);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher }, params }) => {
    const promises = [];
    promises.push(fetcher.models.load({
      app: params.app
    }));
    promises.push(fetcher.networks.load({
      app: params.app
    }));
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
