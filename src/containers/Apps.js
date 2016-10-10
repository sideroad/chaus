import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import {Card, AppForm} from 'components';
import config from '../config';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-connect';
import * as appsActions from 'reducers/apps';
import * as pageActions from 'reducers/page';
import { push } from 'react-router-redux';
import uris from '../uris';
import { stringify } from 'koiki';

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
            dispatch(push(stringify(uris.pages.models, {lang, app})));
          } else {
            fetcher.apps
              .save({
                name: app
              })
              .then(
                () => {
                  fetcher.page.restart().then(
                    () => dispatch(push(stringify(uris.pages.models, {lang, app})))
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
    search: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    prev: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
  };

  static contextTypes = {
    fetcher: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired
  };

  render() {
    const values = {
      app: this.props.query
    };
    const {
      apps,
      query,
      candidate,
      prev,
      next,
      search,
      submit
    } = this.props;
    const { fetcher, i18n } = this.context;
    const styles = {
      base: require('../css/customize.less'),
      app: require('../css/app.less')
    };
    const lang = this.props.params.lang;

    return (
      <div className={styles.base.container} >
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
                start: i18n.start,
                create: i18n.create
              }}
              items={apps.map(_app => {
                _app.url = stringify(uris.pages.models, {lang, app: _app.id});
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
