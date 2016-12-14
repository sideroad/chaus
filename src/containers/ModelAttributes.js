import React, {Component, PropTypes} from 'react';
import __ from 'lodash';
import uris from '../uris';
import {connect} from 'react-redux';
import {AttributeForm} from 'components';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-connect';
import * as pageActions from 'reducers/page';
import * as attributesActions from 'reducers/attributes';
import eachSeries from 'async/mapSeries';
import pluralize from 'pluralize';
import { stringify } from 'koiki';

@asyncConnect([{
  promise: ({helpers: {fetcher}, params}) => {
    const promises = [];

    promises.push(fetcher.models.load({
      app: params.app
    }));
    promises.push(fetcher.attributes.load({
      app: params.app
    }));
    return Promise.all(promises);
  }
}])
@connect(
  (state) => ({
    models: state.models.data,
    attributes: state.attributes.data,
    loaded: state.attributes.loaded,
    loading: state.attributes.loading,
    err: state.attributes.err,
    index: state.attributes.index,
    success: state.attributes.success
  }),
  dispatch => ({
    push,
    delete: (fetcher, app, model, name, lang) => {
      dispatch(pageActions.load());
      fetcher.records.deletes({
        app,
        model: pluralize(name)
      }).then(
        () =>
          fetcher.attributes.deletes({
            app,
            model
          }),
        () =>
          fetcher.attributes.deletes({
            app,
            model
          })
      ).then(
        () =>
          fetcher.models.delete({
            app,
            model
          })
      ).then(
        () => {
          dispatch(pageActions.finishLoad());
          dispatch(push(stringify( uris.pages.models, {lang, app, model})));
        }
      );
    },
    save: (fetcher, app, values) => {
      const model = values.model;
      dispatch(pageActions.load());
      fetcher.attributes
        .deletes({
          app,
          model
        })
        .then(()=>{
          let index = 0;
          eachSeries(
            values.attributes,
            (attribute, callback) => {
              fetcher.attributes
                .save({
                  app,
                  model,
                  ...attribute
                })
                .then(
                  () => callback(null, index++),
                  () => callback({
                    index
                  })
                );
            },
            (err) => {
              if (err) {
                dispatch(attributesActions.failIndex(err.index));
              }
              fetcher.page.restart();
            }
          );
        });
    }
  })
)
export default class ModelAttributes extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
    attributes: PropTypes.array.isRequired,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    save: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    err: PropTypes.object,
    index: PropTypes.number,
    success: PropTypes.bool
  };
  static contextTypes = {
    fetcher: PropTypes.object.isRequired
  };

  render() {
    const {
      models,
      attributes,
      loading,
      loaded,
      err,
      success
    } = this.props;
    const {name, app, lang} = this.props.params;
    const {fetcher} = this.context;
    const styles = require('../css/customize.less');
    const contentsClass = loading ? styles.loading :
                          loaded ? styles.loaded : '';
    return (
      <div className={'uk-width-medium-8-10 ' + styles.contents} >
        { err ?
          <div className="uk-alert uk-alert-danger">
          {Object.keys(err).map((key) =>
            <div key={key}>
              {key}: {err[key]}
            </div>)}
          </div> : ''}
        { success &&
          <div className="uk-alert uk-alert-success">
            Model updated successfully.
          </div>}
        <div className={contentsClass}>
          <div className="uk-grid" >
            <div className="uk-width-6-10" >
              <h1 className={styles['cm-title']} >{name}</h1>
            </div>
            <div className="uk-width-4-10 uk-text-right" >
              <button className={'uk-button uk-button-danger uk-button-large ' + styles['cm-button'] + ' ' + styles['cm-danger-button']} type="button"
                onClick={
                  () =>
                    this.props.delete(fetcher, app, __.find(models, {name}).id, name, lang)
                }
              >
                <i className={'uk-icon-trash ' + styles['cm-icon'] + ' ' + styles['cm-trash-button']}/>
                <span className={styles['cm-delete-button-text']}>Delete</span>
              </button>
            </div>
          </div>
          <AttributeForm
            model={name}
            app={app}
            initialValues={{
              attributes: attributes.map(attribute => {
                const _attribute = Object.assign({}, attribute);
                if ( _attribute.relation ) {
                  _attribute.relation = _attribute.relation.id;
                }
                const model = __.find(models, {id: _attribute.model.id, name});
                if ( !model ) {
                  return false;
                }
                return _attribute;
              }).filter(attribute => attribute ? true : false),
              model: __.find(models, {name}).id
            }}
            relations={models}
            onSave={(values) => this.props.save(fetcher, app, values)}
            err={err}
            index={this.props.index}
          />
        </div>
      </div>
    );
  }
}
