import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {load} from 'redux/modules/attributes';
import * as modelActions from 'redux/modules/models';
import {AttributeForm} from 'components';
import {initializeWithKey} from 'redux-form';
import {reduxForm} from 'redux-form';
import { routeActions } from 'react-router-redux';
import * as pageActions from 'redux/modules/page';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch}}) => {
    return dispatch(load());
  }
}])
@connect(
  (state) => ({
    attributes: state.attributes.data,
    loaded: state.attributes.loaded,
    loading: state.attributes.loading
  }),
  {
    ...modelActions,
    loadPage: pageActions.load,
    finishLoad: pageActions.finishLoad,
    pushState: routeActions.push,
    initializeWithKey})
@reduxForm({
  form: 'modelButton',
  fields: []
})
export default class Attributes extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    attributes: PropTypes.object.isRequired,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    finishLoad: PropTypes.func.isRequired
  };

  render() {
    const {
      attributes,
      remove,
      handleSubmit,
      loading,
      loaded,
      loadPage,
      finishLoad
    } = this.props;
    const {name} = this.props.params;
    const styles = require('../css/customize.less');
    const contentsClass = loading ? styles['cm-beam-in'] :
                          loaded ? styles['cm-beam-out'] : '';
    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
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
                    return remove(name)
                      .then(result => {
                        finishLoad();
                        if (result && typeof result.error === 'object') {
                          return Promise.reject(result.error);
                        }
                        this.props.pushState(null, '/admin');
                      });
                  })}
              >
                <i className={'uk-icon-trash ' + styles['cm-icon']}/>
                <span className={styles['cm-delete-button-text']}>Delete</span>
              </button>
            </div>
          </div>
          <AttributeForm
            model={name}
            initialValues={{
              attributes: attributes[name],
              model: name
            }} />
        </div>
      </div>
    );
  }
}
