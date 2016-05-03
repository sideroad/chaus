import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {load} from 'redux/modules/attributes';
import {AttributeForm} from 'components';
import {initializeWithKey} from 'redux-form';
import {reduxForm} from 'redux-form';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
import * as modelActions from 'redux/modules/models';
import * as pageActions from 'redux/modules/page';
import * as recordActions from 'redux/modules/records';

@asyncConnect([{
  promise: ({store: {dispatch}, params}) => {
    return dispatch(load(params.app));
  }
}])
@connect(
  (state) => ({
    attributes: state.attributes.data,
    loaded: state.attributes.loaded,
    loading: state.attributes.loading,
    saveError: state.attributes.error,
    saveSuccess: state.attributes.saveSuccess
  }),
  {
    ...modelActions,
    loadPage: pageActions.load,
    finishLoad: pageActions.finishLoad,
    push,
    removeRecords: recordActions.removeAll,
    initializeWithKey})
@reduxForm({
  form: 'modelButton',
  fields: []
})
export default class Attributes extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    removeRecords: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    attributes: PropTypes.object.isRequired,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    finishLoad: PropTypes.func.isRequired,
    saveError: PropTypes.object,
    saveSuccess: PropTypes.bool
  };

  render() {
    const {
      attributes,
      remove,
      removeRecords,
      handleSubmit,
      loading,
      loaded,
      loadPage,
      finishLoad,
      saveError,
      saveSuccess
    } = this.props;
    const {name, app, lang} = this.props.params;
    const styles = require('../css/customize.less');
    const contentsClass = loading ? styles.loading :
                          loaded ? styles.loaded : '';
    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
        { saveError ?
          <div className="uk-alert uk-alert-danger">
          {Object.keys(saveError.err).map((key) =>
            <div key={key}>
              {key}: {saveError.err[key]}
            </div>)}
          </div> : ''}
        { saveSuccess &&
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
                  handleSubmit(() => {
                    loadPage();
                    return removeRecords(app, name)
                             .then(()=> {
                               return remove(app, name);
                             })
                             .then(result => {
                               finishLoad();
                               if (result && typeof result.error === 'object') {
                                 return Promise.reject(result.error);
                               }
                               this.props.push('/apps/' + lang + '/' + app + '/models');
                             });
                  })}
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
              attributes: attributes[name],
              model: name
            }}
            saveError={saveError} />
        </div>
      </div>
    );
  }
}
