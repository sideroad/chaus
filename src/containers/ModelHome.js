import React, {Component, PropTypes} from 'react';
import {load} from 'redux/modules/models';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import {Card} from 'components';
import uris from '../uris';
import Graph from '../helpers/react-graph-vis';
import { push } from 'react-router-redux';

@asyncConnect([{
  promise: ({store: {dispatch}, params}) => {
    return dispatch(load(params.app));
  }
}])
@connect(
  (state) => ({
    models: state.models.data,
    open: state.page.open
  }),
  {
    push
  }
)
export default class ModelHome extends Component {
  static propTypes = {
    models: PropTypes.array,
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
      models,
      params: {lang, app}
    } = this.props;

    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles['cm-title']}>{contents.title}</h1>
          <hr className="uk-article-divider" />
          <Graph
            dot={'dinetwork {user -> event; event -> candidate; user -> candidate }'}
            onSelectNode={
              node => {
                this.props.push(uris.normalize(uris.apps.model, {lang, app, name: node}));
              }
            }
          />
          <Card items={
              models.map(_model => {
                _model.url = uris.normalize(uris.apps.model, {lang, app, name: _model.name});
                console.log(_model);
                return _model;
              })
            } />
        </article>
      </div>
    );
  }
}
