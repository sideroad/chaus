import React, {Component, PropTypes} from 'react';
import {isLoaded, load} from 'redux/modules/models';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import {Card} from 'components';
import uris from '../uris';


@asyncConnect([{
  promise: ({store: {dispatch, getState}, params}) => {
    if (!isLoaded(getState(), params.app)) {
      return dispatch(load(params.app));
    }
  }
}])
@connect(
  (state, props) => ({
    models: state.models[props.params.app].data,
    open: state.page.open
  }),
  {}
)
export default class ModelHome extends Component {
  static propTypes = {
    models: PropTypes.array,
    params: PropTypes.object.isRequired
  }

  render() {
    const styles = require('../css/customize.less');
    const contents = {
      title: 'Models',
      lead: 'Build RESTful API within 5 min'
    };
    const {models, params: {lang, app}} = this.props;

    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles['cm-title']}>{contents.title}</h1>
          <hr className="uk-article-divider" />
          <Card items={
              models.map(_model => {
                _model.url = uris.normalize(uris.apps.model, {lang, app, name: _model.name});
                return _model;
              })
            } />
        </article>
      </div>
    );
  }
}
