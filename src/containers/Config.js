import React, {Component, PropTypes} from 'react';
import Main from '../containers/Main';
import ConfigForm from '../components/ConfigForm';
import { connect } from 'react-redux';
import * as pageActions from '../reducers/page';
import Helmet from 'react-helmet';
import config from '../config';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-connect';
import eachSeries from 'async/mapSeries';
import { formValueSelector } from 'redux-form';
import uris from '../uris';
import { stringify } from 'koiki';

const selector = formValueSelector('apps');

class Config extends Component {
  render() {
    const {
      configs,
      origins,
      models,
      open,
      callFromServer
    } = this.props;

    const {
      app,
      lang
    } = this.props.params;
    const {fetcher} = this.context;

    const styles = require('../css/customize.less');
    return (
      <div className={styles.container} >
        <Helmet {...config.app.head} title="Configure API settings" />
        <Main
          models={models}
          open={open}
          context="configs"
          app={app}
          children={
            <div className={'uk-width-medium-8-10 ' + styles.contents} >
              <ConfigForm
                initialValues={console.log({...configs, origins}) || {...configs, origins}}
                lang={lang}
                app={app}
                onSave={values => this.props.save(fetcher, app, values)}
                onDelete={() => this.props.delete(fetcher, app, lang)}
                callFromServer={callFromServer}
              />
            </div>
          }
          lang={lang}/>
      </div>
    );
  }
}

const connected = connect(
  (state) => ({
    models: state.models.data,
    configs: state.configs.data,
    origins: state.origins.data,
    open: state.page.open,
    callFromServer: selector(state, 'caller') === 'server'
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
            dispatch(push(stringify( uris.pages.apps, {lang})));
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
)(Config);

Config.propTypes = {
  configs: PropTypes.object,
  origins: PropTypes.array,
  open: PropTypes.bool,
  models: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  callFromServer: PropTypes.bool.isRequired
};

Config.contextTypes = {
  fetcher: PropTypes.object.isRequired
};

const asynced = asyncConnect([{
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
}])(connected);

export default asynced;
