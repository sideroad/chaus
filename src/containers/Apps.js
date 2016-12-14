import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import {Card, AppForm} from 'components';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-connect';
import * as appsActions from 'reducers/apps';
import * as pageActions from 'reducers/page';
import { push } from 'react-router-redux';
import { v4 } from 'uuid';

import config from '../config';
import uris from '../uris';
import { stringify } from 'koiki';

@asyncConnect([{
  promise: ({helpers: {fetcher}}) => {
    const promises = [];
    console.log('ここっす');
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
    candidate: state.apps.candidate,
    user: state.user.item
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
                name: app,
                caller: 'client',
                client: v4()
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
    user: PropTypes.object.isRequired
  };

  static contextTypes = {
    fetcher: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired
  };

  render() {
    const {
      apps,
      query,
      candidate,
      prev,
      next,
      search,
      submit,
      user
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
            user.id ?
              <div className={styles.app.app}>
                <AppForm
                  query={query}
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
            :
              <div className={styles.app.app}>
                <div className={styles.app.lead}>
                  Creat API within 5 minutes
                </div>
                <div className={styles.app.box}>
                  <button className={'uk-button uk-button-primary uk-button-large ' + styles['cm-button']}
                    onClick={
                      () => location.href = `${config.global.base}/auth/github`
                    }
                  >
                    <i className={'uk-icon-sign-in ' + styles.base['cm-icon']}/>
                    Login with Github to create API
                  </button>
                </div>
              </div>
        }
        lang={lang}
      />
      </div>
    );
  }
}
