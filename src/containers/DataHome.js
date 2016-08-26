import React, {Component, PropTypes} from 'react';
import {Card} from 'components';
import uris from '../uris';
import {load} from 'redux/modules/models';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';

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
  {}
)
export default class DataHome extends Component {
  static propTypes = {
    models: PropTypes.array,
    params: PropTypes.object.isRequired
  }

  render() {
    const styles = require('../css/customize.less');
    const contents = {
      title: 'Data',
      lead: 'Manipulate API data'
    };
    const {models, params: {lang, app}} = this.props;

    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles['cm-title']}>{contents.title}</h1>
          <hr className="uk-article-divider" />
          <Card items={
              models.map(_model => {
                _model.url = uris.normalize(uris.apps.records, {lang, app, name: _model.name});
                return _model;
              })
            } />
        </article>
      </div>
    );
  }
}
