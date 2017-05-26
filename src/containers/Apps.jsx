import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { push } from 'react-router-redux';
import { v4 } from 'uuid';
import { stringify } from 'koiki';

import Header from '../components/Header';
import Search from '../components/Search';
import Card from '../components/Card';
import * as appsActions from '../reducers/apps';
import * as pageActions from '../reducers/page';
import config from '../config';
import uris from '../uris';

const Apps = (props, context) => {

  const search = props.search;
  const submit = props.submit;

  return (
    <div>
      <Helmet {...config.app.head} title="Find, Create your App" />
      <Header
        url={stringify(uris.pages.apps, {
          lang: props.lang,
        })}
      />
      <Search
        query={props.query}
        onChange={
          _query => search(context.fetcher, _query)
        }
        onEnter={
          app => submit(context.fetcher, app, props.lang)
        }
        onTab={
          (app) => {
            if (app) {
              props.search(context.fetcher, app);
            }
          }
        }
        onPrev={props.prev}
        onNext={props.next}
        lang={props.lang}
        candidate={props.candidate}
      />
      <Card
        lead={{
          start: context.i18n.start,
          create: context.i18n.create
        }}
        items={props.apps.map(_app =>
          ({
            ..._app,
            url: stringify(uris.pages.models, {
              lang: props.lang,
              app: _app.id
            })
          })
        )}
        query={props.query}
        candidate={props.candidate}
      />
    </div>
  );
};

const connected = connect(
  (state, ownProps) => ({
    query: state.apps.query,
    apps: state.apps.data,
    candidate: state.apps.candidate,
    user: state.user.item,
    lang: ownProps.params.lang,
  }),
  dispatch => ({
    search: (fetcher, query) => {
      dispatch(appsActions.query(query));
      fetcher.apps.load({
        name: query ? `${query}*` : ''
      });
    },
    prev: () => dispatch(appsActions.prev()),
    next: () => dispatch(appsActions.next()),
    submit: (fetcher, app, lang) => {
      if (!app) {
        return;
      }
      dispatch(pageActions.load());

      fetcher.apps
        .load({
          name: app
        })
        .then((res) => {
          if (res.body.items.length) {
            dispatch(pageActions.finishLoad());
            dispatch(push(stringify(uris.pages.models, { lang, app })));
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
                    () => dispatch(push(stringify(uris.pages.models, { lang, app })))
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
)(Apps);

Apps.propTypes = {
  query: PropTypes.string,
  apps: PropTypes.array.isRequired,
  candidate: PropTypes.string,
  search: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

Apps.contextTypes = {
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher } }) => {
    const promises = [];
    promises.push(
      fetcher.apps.load()
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
