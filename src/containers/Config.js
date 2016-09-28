import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import {ConfigForm} from 'components';
import { connect } from 'react-redux';
import * as pageActions from 'modules/page';
import Helmet from 'react-helmet';
import config from '../config';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-connect';
import eachSeries from 'async/mapSeries';
import uris from '../uris';

@asyncConnect([{
  promise: ({params, helpers: {fetcher}}) => {
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
}])
@connect(
  (state) => ({
    models: state.models.data,
    configs: state.configs.data,
    origins: state.origins.data,
    open: state.page.open
  }),
  dispatch => ({
    delete: (fetcher, app, lang) => {
      fetcher.origins
        .deletes({
          app
        }).then(
          () =>
            fetcher.attributes.deletes({
              app
            })
        ).then(
          () =>
            fetcher.models.deletes({
              app
            })
        ).then(
          () =>
            fetcher.origins.deletes({
              app
            })
        ).then(
          () =>
            fetcher.apps.delete({
              app
            })
        ).then(
          () => {
            dispatch(pageActions.finishLoad());
            dispatch(push(uris.normalize( uris.apps.apps, {lang})));
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
          fetcher.origins.deletes({
            app
          })
        .then(() => {
          eachSeries(
            values.origins,
            (origin, callback) => {
              fetcher.origins
                .save({
                  app,
                  ...origin
                })
                .then(
                  () => callback(),
                  err => callback(err)
                );
            },
            () => {
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
                );
            }
        );
        })
      );
    }
  })
)
export default class Config extends Component {
  static propTypes = {
    configs: PropTypes.object,
    origins: PropTypes.array,
    open: PropTypes.bool,
    models: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired
  }
  static contextTypes = {
    fetcher: PropTypes.object.isRequired
  };

  render() {
    const {
      configs,
      origins,
      models,
      open
    } = this.props;

    const {
      app,
      lang
    } = this.props.params;
    const {fetcher} = this.context;

    const styles = require('../css/customize.less');
    return (
      <div className={styles['cm-container']} >
        <Helmet {...config.app.head} title="Configure API settings" />
        <Main
          models={models}
          open={open}
          context="configs"
          app={app}
          children={
            <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
              <ConfigForm
                initialValues={{...configs, origins}}
                lang={lang}
                app={app}
                onSave={values => this.props.save(fetcher, app, values)}
                onDelete={() => this.props.delete(fetcher, app, lang)}
              />
            </div>
          }
          lang={lang}/>
      </div>
    );
  }
}
