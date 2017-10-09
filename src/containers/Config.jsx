import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { v4 } from 'uuid';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-connect';
import { formValueSelector } from 'redux-form';
import { stringify } from 'koiki';

import Main from '../containers/Main';
import ConfigForm from '../components/ConfigForm';
import * as pageActions from '../reducers/page';
import config from '../config';
import uris from '../uris';

const selector = formValueSelector('apps');

const Config = (props, context) =>
  <div>
    <Helmet {...config.app.head} title="API configuration" />
    <Main
      models={props.models}
      open={props.open}
      context="configs"
      app={props.app}
      lang={props.lang}
    >
      <ConfigForm
        initialValues={{ ...props.configs, origins: props.origins }}
        lang={props.lang}
        app={props.app}
        onSubmit={({ caller, client, secret, description, origins }) =>
          props.save(context.fetcher, props.app, {
            caller,
            client: client || v4(),
            secret: caller === 'server' ? secret || v4() : '',
            description,
            origins
          })
        }
        err={props.err}
        index={props.index}
        onDelete={() => props.delete(context.fetcher, props.app, props.lang)}
        callFromServer={props.callFromServer}
      />
    </Main>
  </div>;

Config.propTypes = {
  configs: PropTypes.object,
  origins: PropTypes.array,
  open: PropTypes.bool,
  models: PropTypes.array.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  save: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  callFromServer: PropTypes.bool.isRequired,
  app: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  err: PropTypes.object,
  index: PropTypes.number.isRequired,
};

Config.contextTypes = {
  fetcher: PropTypes.object.isRequired
};

const connected = connect(
  (state, ownProps) => ({
    models: state.models.data,
    configs: state.configs.data,
    origins: state.origins.data,
    err: state.origins.err,
    index: state.origins.index,
    open: state.page.open,
    app: ownProps.params.app,
    lang: ownProps.params.lang,
    callFromServer: selector(state, 'caller') === 'server'
  }),
  dispatch => ({
    delete: (fetcher, app, lang) => {
      fetcher.origins
        .deletes({
          app
        })
        .then(
          () =>
            fetcher.attributes.deletes({
              app
            })
        )
        .then(
          () =>
            fetcher.models.deletes({
              app
            })
        )
        .then(
          () =>
            fetcher.origins.deletes({
              app
            })
        )
        .then(
          () =>
            fetcher.apps.delete({
              app
            })
        )
        .then(
          () => {
            dispatch(pageActions.finishLoad());
            dispatch(push(stringify(uris.pages.apps, { lang })));
          }
        );
    },
    save: (fetcher, app, values) => {
      dispatch(pageActions.load());
      fetcher.configs
        .save({
          app,
          ...values
        })
        .then(() =>
          fetcher.origins.validates({
            app,
            items: values.origins.map(origin => ({
              app,
              ...origin,
            }))
          })
        )
        .then(() =>
          fetcher.origins.deletes({
            app
          })
          .then(() =>
            fetcher.origins
              .save({
                app,
                items: values.origins.map(origin => ({
                  app,
                  ...origin,
                }))
              })
          ),
          () => {}
        )
        .then(() =>
          fetcher.configs
            .load({
              app
            })
            .then(
              () =>
                fetcher.origins.load({
                  app
                })
            )
            .then(
              () =>
                fetcher.page.restart()
            )
        );
    }
  })
)(Config);

const asynced = asyncConnect([{
  promise: ({ params, helpers: { fetcher } }) => {
    const promises = [];
    promises.push(fetcher.models.load({
      app: params.app
    }));
    promises.push(fetcher.configs.load({
      app: params.app
    }));
    promises.push(fetcher.origins.load({
      app: params.app
    }));
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
