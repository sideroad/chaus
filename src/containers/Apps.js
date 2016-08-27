import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import {Card, AppForm} from 'components';
import config from '../config';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as appsActions from 'redux/modules/apps';
import { asyncConnect } from 'redux-async-connect';
import { push } from 'react-router-redux';
import uris from '../uris';

@asyncConnect([{
  promise: ({store: {dispatch}}) => {
    const promises = [];
    promises.push(dispatch(appsActions.load()));
    return Promise.all(promises);
  }
}])
@connect(
  (state)=>({
    msg: state.i18n.msg,
    query: state.apps.query,
    apps: state.apps.data,
    candidate: state.apps.candidate
  }),
  {
    push
  })
export default class Apps extends Component {
  static propTypes = {
    query: PropTypes.string,
    apps: PropTypes.array.isRequired,
    candidate: PropTypes.string,
    params: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired
  };

  render() {
    const values = {
      app: this.props.query
    };
    const {
      msg,
      apps,
      query,
      candidate
    } = this.props;
    const styles = {
      base: require('../css/customize.less'),
      app: require('../css/app.less')
    };
    const lang = this.props.params.lang;

    return (
      <div className={styles.base['cm-container']} >
        <Helmet {...config.app.head} title="Find, Create your App" />
        <Main children={
          <div className={styles.app.app}>
            <AppForm initialValues={
              values
            } lang={lang}/>
            <Card
              lead={{
                start: msg.app.start,
                create: msg.app.create
              }}
              items={apps.map(_app => {
                _app.url = uris.normalize(uris.apps.models, {lang, app: _app.id});
                return _app;
              })}
              query={query}
              candidate={candidate}
            />
          </div>
        } lang={lang}/>
      </div>
    );
  }
}
