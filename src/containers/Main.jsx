import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { stringify } from 'koiki';
import { push } from 'react-router-redux';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import * as pageActions from '../reducers/page';
import * as modelsActions from '../reducers/models';
import uris from '../uris';
import styles from '../css/main.less';

const Main = (props, context) => {
  const save = props.save;
  return (
    <div className={props.open ? styles.fixed : ''} >
      <Header
        toggle={props.toggleSidebar}
        url={stringify(uris.pages.apps, {
          lang: props.lang,
        })}
        open={props.open}
      />
      <div className={styles.columns}>
        <div className={`${styles.left} ${props.open ? styles.open : ''}`}>
          <Sidebar
            models={props.models}
            context={props.context}
            modelName={props.modelName}
            app={props.app}
            lang={props.lang}
            err={props.err}
            editing={props.editing}
            onBlur={props.cancel}
            closeSidebar={props.closeSidebar}
            onAdd={props.add}
            onSave={values => save(context.fetcher, values, props.lang)}
            onDropFiles={files =>
              props.importJson(context.fetcher, props.lang, props.app, files)
            }
          />
        </div>
        <div className={`${styles.right} ${props.open ? styles.open : ''}`} >
          {props.children}
        </div>
      </div>
      <button
        className={`${styles.modal} ${props.open ? styles.open : ''}`}
        onClick={props.closeSidebar}
      />
      <Loading />
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.object.isRequired,
  models: PropTypes.array,
  open: PropTypes.bool,
  modelName: PropTypes.string,
  app: PropTypes.string,
  editing: PropTypes.bool,
  add: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  context: PropTypes.string,
  lang: PropTypes.string.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  importJson: PropTypes.func.isRequired,
  err: PropTypes.object,
};

Main.contextTypes = {
  fetcher: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    editing: state.models.editing,
    err: state.models.err,
  }),
  dispatch => ({
    cancel: () => dispatch(modelsActions.cancel()),
    add: () => dispatch(modelsActions.add()),
    save: (fetcher, values, lang) => {
      if (values.name) {
        dispatch(pageActions.closeSidebar());
        dispatch(pageActions.load());
        fetcher.models.save(values).then(
          () => {
            fetcher.models.load({
              app: values.app
            })
            .then(() => {
              dispatch(pageActions.finishLoad());
              dispatch(push(stringify(uris.pages.model, {
                lang,
                app: values.app,
                name: values.name
              })));
            });
          },
          () => {
            dispatch(pageActions.finishLoad());
          }
        );
      }
    },
    importJson: (fetcher, lang, app, schemes) => {
      dispatch(pageActions.load());
      fetcher.json.import({
        app,
        schemes
      }).then(
        () => fetcher.page.restart()
      ).then(
        () => {
          dispatch(pageActions.finishLoad());
          dispatch(push(stringify(uris.pages.models, {
            lang,
            app,
          })));
        }
      );
    },
    toggleSidebar: () => dispatch(pageActions.toggleSidebar()),
    closeSidebar: () => dispatch(pageActions.closeSidebar())
  })
)(Main);

export default connected;
