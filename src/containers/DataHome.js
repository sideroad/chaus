import React, {Component, PropTypes} from 'react';
import Card from '../components/Card';
import uris from '../uris';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { stringify } from 'koiki';

class DataHome extends Component {

  render() {
    const styles = require('../css/customize.less');
    const contents = {
      title: 'Data',
      lead: 'Manipulate API data'
    };
    const { models, params: { lang, app } } = this.props;

    return (
      <div className={'uk-width-medium-8-10 ' + styles.contents} >
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles['cm-title']}>{contents.title}</h1>
          <hr className="uk-article-divider" />
          <Card
            lead={{
              start: 'Click + to create Model on sidebar',
              create: ''
            }}
            items={
              models.map(_model => {
                _model.url = stringify(uris.pages.records, {lang, app, name: _model.name});
                return _model;
              })
            }
          />
        </article>
      </div>
    );
  }
}

DataHome.propTypes = {
  models: PropTypes.array,
  params: PropTypes.object.isRequired
};

const connected = connect(
  (state) => ({
    models: state.models.data,
    open: state.page.open
  }),
  {}
)(DataHome);

const asynced = asyncConnect([{
  promise: ({helpers: {fetcher}, params}) => {
    return fetcher.models.load({
      app: params.app
    });
  }
}])(connected);

export default asynced;
