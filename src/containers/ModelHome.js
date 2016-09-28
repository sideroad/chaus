import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Card} from 'components';
import { asyncConnect } from 'redux-connect';
import uris from '../uris';
import Graph from '../helpers/react-graph-vis';
import { push } from 'react-router-redux';

@asyncConnect([{
  promise: ({helpers: {fetcher}, params}) => {
    const promises = [];
    promises.push(fetcher.models.load({
      app: params.app
    }));
    promises.push(fetcher.networks.load({
      app: params.app
    }));
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
          {
            networks ?
            <Graph
              dot={'digraph {' + networks + '}'}
              onSelectNode={
                node => {
                  this.props.push(uris.normalize(uris.apps.model, {lang, app, name: node}));
                }
              }
            />
            :
            <Card
              lead={{
                start: 'Click + to create Model on sidebar',
                create: ''
              }}
              items={[]}
            />
          }
        </article>
      </div>
    );
  }
}
