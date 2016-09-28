import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import {Card, AppForm} from 'components';
import config from '../config';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as appsActions from 'modules/apps';
import * as pageActions from 'modules/page';
import { asyncConnect } from 'redux-connect';
import { push } from 'react-router-redux';
import uris from '../uris';

@asyncConnect([{
  promise: ({helpers: {fetcher}}) => {
    const promises = [];
    promises.push(
      fetcher.apps.load()
    );
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
  dispatch => ({
    search: (fetcher, query) => {
      dispatch(appsActions.query(query));
      fetcher.apps.load({
        name: query ? query + '*' : ''
      });
    },
    prev: () => dispatch(appsActions.prev()),
    next: () => dispatch(appsActions.next()),
    submit: (fetcher, app, lang) => {
      if ( !app ) {
        return;
      }
      dispatch(pageActions.load());

      fetcher.apps
        .load({
          name: app
        })
        .then(res => {
          if ( res.items.length ) {
            dispatch(pageActions.finishLoad());
            dispatch(push(uris.normalize(uris.apps.models, {lang, app})));
          } else {
            fetcher.apps
              .save({
                name: app
              })
              .then(
                () => {
                  fetcher.page.restart().then(
                    () => dispatch(push(uris.normalize(uris.apps.models, {lang, app})))
                  );
                },
                () => {
                  dispatch(pageActions.finishLoad());
                }
              );
          }
        });
    },
    push
  })
)
export default class Apps extends Component {
  static propTypes = {
    query: PropTypes.string,
    apps: PropTypes.array.isRequired,
    candidate: PropTypes.string,
    params: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    search: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    prev: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
  };

  static contextTypes = {
    fetcher: PropTypes.object.isRequired
  };

  render() {
    const values = {
      app: this.props.query
    };
    const {
      msg,
      apps,
      query,
      candidate,
      prev,
      next,
      search,
      submit
    } = this.props;
    const {fetcher} = this.context;
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
            <AppForm
              initialValues={
                values
              }
              onChange={
                _query => search(fetcher, _query)
              }
              onEnter={
                app => {
                  submit(fetcher, app, lang);
                }
              }
              onTab={
                app => {
                  if (app) {
                    search(fetcher, app);
                  }
                }
              }
              onPrev={
                () => prev()
              }
              onNext={
                () => next()
              }
              lang={lang}
              candidate={candidate}
            />
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
        }
        lang={lang}
      />
      </div>
    );
  }
}
