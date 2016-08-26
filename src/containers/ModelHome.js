import React, {Component, PropTypes} from 'react';
import {load as loadModels} from 'redux/modules/models';
import {load as loadNetworks} from 'redux/modules/networks';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import uris from '../uris';
import Graph from '../helpers/react-graph-vis';
import { push } from 'react-router-redux';

@asyncConnect([{
  promise: ({store: {dispatch}, params}) => {
    const promises = [];
    promises.push(dispatch(loadModels(params.app)));
    promises.push(dispatch(loadNetworks(params.app)));
    return Promise.all(promises);
  }
}])
@connect(
  (state) => ({
    models: state.models.data,
    networks: state.networks.data,
    open: state.page.open
  }),
  {
    push
  }
)
export default class ModelHome extends Component {
  static propTypes = {
    networks: PropTypes.string,
    params: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired
  }

  render() {
    const styles = require('../css/customize.less');
    const contents = {
      title: 'Models',
      lead: 'Build RESTful API within 5 min'
    };
    const {
      networks,
      params: {lang, app}
    } = this.props;

    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles['cm-title']}>{contents.title}</h1>
          <hr className="uk-article-divider" />
          <Graph
            dot={'dinetwork {' + networks + '}'}
            onSelectNode={
              node => {
                this.props.push(uris.normalize(uris.apps.model, {lang, app, name: node}));
              }
            }
          />
        </article>
      </div>
    );
  }
}
