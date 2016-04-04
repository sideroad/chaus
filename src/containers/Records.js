import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {load as loadAttributes} from 'redux/modules/attributes';
import {load as loadRecords, add} from 'redux/modules/records';
import * as modelActions from 'redux/modules/models';
import {RecordForm} from 'components';
import {initializeWithKey} from 'redux-form';
import {reduxForm} from 'redux-form';
import {pushState} from 'redux-router';
import * as pageActions from 'redux/modules/page';
import moment from 'moment';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({params, store: {dispatch, getState}}) => {
    const state = getState();
    const promises = [];
    console.log(params, state);
    console.log('# dispatch loading attributes');
    promises.push(dispatch(loadAttributes(state)));
    promises.push(dispatch(loadRecords(params.name)));
    return Promise.all(promises);
  }
}])
@connect(
  (state) => ({
    attributes: state.attributes.data,
    loaded: state.attributes.loaded,
    loading: state.attributes.loading,
    records: state.records.data,
    recordError: state.records.error,
    saveSuccess: state.records.saveSuccess
  }),
  {
    ...modelActions,
    addRecord: add,
    loadPage: pageActions.load,
    finishLoad: pageActions.finishLoad,
    pushState,
    initializeWithKey})
@reduxForm({
  form: 'modelButton',
  fields: []
})
export default class Records extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    attributes: PropTypes.object.isRequired,
    records: PropTypes.array.isRequired,
    recordError: PropTypes.object,
    saveSuccess: PropTypes.bool,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    finishLoad: PropTypes.func.isRequired,
    addRecord: PropTypes.func.isRequired
  };

  render() {
    const {
      attributes,
      records,
      loading,
      loaded,
      recordError,
      addRecord,
      saveSuccess
    } = this.props;
    const {name} = this.props.params;
    const styles = require('../css/customize.less');
    const contentsClass = loading ? styles['cm-beam-in'] :
                          loaded ? styles['cm-beam-out'] : '';
    const targets = (attributes[name] || []).filter((attribute) => {
      return attribute.type === 'children' ? false : true;
    });
    const items = records.map((record) => {
      const values = {};
      targets.map(attribute => {
        const value = record[attribute.name];
        switch (attribute.type) {
          case 'date':
            values[attribute.name] = value ? moment(value).format('YYYY-MM-DD') : '';
            break;
          case 'parent':
            values[attribute.name] = value ? value.id : '';
            break;
          case 'instance':
            values[attribute.name] = value ? value.id : '';
            break;
          default:
            values[attribute.name] = value;
        }
      });
      values.id = record.id;
      return values;
    });
    const fields = targets.map((attribute) => attribute.name).concat(['model']);
    console.log(records);

    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
        { recordError ?
          <div className="uk-alert uk-alert-danger">
          {Object.keys(recordError.err).map((key) =>
            <div key={key}>
              {key}: {recordError.err[key]}
            </div>)}
          </div> : ''}
        { saveSuccess &&
          <div className="uk-alert uk-alert-success">
            Records updated successfully.
          </div>}
        <div className={contentsClass}>
          <div className="uk-grid" >
            <div className="uk-width-1" >
              <h1 className={styles['cm-title']} >{name}</h1>
            </div>
          </div>
          <form className="uk-form">
            <table className={styles['cm-table'] + ' uk-table uk-table-striped uk-table-condensed'}>
              <thead>
                  <tr>
                    <th>id</th>
                    {
                      targets.map((attribute, index)=> (<th key={index}>{attribute.name}</th>))
                    }
                  </tr>
              </thead>
              <tbody>
                {
                  items && items.map((item, index) =>
                    (<RecordForm
                      formKey={name + index}
                      fields={fields}
                      targets={targets}
                      key={name + index}
                      model={name}
                      id={item.id}
                      items={items}
                      initialValues={item}
                      recordError={recordError && item.id === recordError.id ? recordError : undefined}
                    />)
                  )
                }
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="8" className={styles['cm-row-plus']} >
                    <button className={'uk-button ' + styles['cm-row-plus']} onClick={event => {
                      event.preventDefault(); // prevent form submission
                      addRecord();
                    }}>
                      <i className="uk-icon-plus uk-icon-small"></i>
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </form>
        </div>
      </div>
    );
  }
}
