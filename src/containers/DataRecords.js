import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as recordActions from 'modules/records';
import {RecordForm} from 'components';
import {reduxForm} from 'redux-form';
import * as pageActions from 'modules/page';
import moment from 'moment';
import { asyncConnect } from 'redux-connect';
import pluralize from 'pluralize';
import __ from 'lodash';

@asyncConnect([{
  promise: ({params, helpers: {fetcher}}) => {
    const promises = [];
    promises.push(fetcher.models.load({
      app: params.app
    }));
    promises.push(fetcher.attributes.load({
      app: params.app
    }));
    promises.push(fetcher.records.load({
      app: params.app,
      model: pluralize( params.name )
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
    records: state.records.data,
    err: state.records.err,
    index: state.records.index,
    success: state.records.success
  }),
  dispatch => ({
    add: () => dispatch(recordActions.add()),
    delete: (fetcher, app, model, id) => {
      dispatch(pageActions.load());
      fetcher.records
        .delete({
          app,
          model: pluralize(model),
          id
        })
        .then(
          () =>
          fetcher.records
            .load({
              app,
              model: pluralize(model)
            })
        )
        .then(
          () => dispatch(pageActions.finishLoad())
        )
        .catch(
          () => dispatch(pageActions.finishLoad())
        );
    },
    create: (fetcher, app, model, values, index) => {
      dispatch(pageActions.load());
      fetcher.records
        .create({
          ...values,
          app,
          model: pluralize(model)
        })
        .then(
          () =>
          fetcher.records
            .load({
              app,
              model: pluralize(model)
            })
        )
        .then(
          () => dispatch(pageActions.finishLoad()),
          () => {
            dispatch(recordActions.failIndex(index));
            dispatch(pageActions.finishLoad());
          }
        )
        .catch(
          () => dispatch(pageActions.finishLoad())
        );
    },
    update: (fetcher, app, model, id, values, targets, index) => {
      dispatch(pageActions.load());
      const updates = {};
      targets.map(attribute => {
        if (!attribute.uniq) {
          updates[attribute.name] = values[attribute.name];
        }
      });
      fetcher.records
        .update({
          ...updates,
          id,
          app,
          model: pluralize(model)
        })
        .then(
          () =>
          fetcher.records
            .load({
              app,
              model: pluralize(model)
            })
        )
        .then(
          () => dispatch(pageActions.finishLoad()),
          () => {
            dispatch(recordActions.failIndex(index));
            dispatch(pageActions.finishLoad());
          }
        )
        .catch(
          () => dispatch(pageActions.finishLoad())
        );
    }
  })
)
@reduxForm({
  form: 'modelButton',
  fields: []
})
export default class DataRecords extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
    attributes: PropTypes.array.isRequired,
    records: PropTypes.array.isRequired,
    err: PropTypes.object,
    index: PropTypes.number,
    success: PropTypes.bool,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired
  };
  static contextTypes = {
    fetcher: PropTypes.object.isRequired
  };

  render() {
    const {
      attributes,
      models,
      records,
      loading,
      loaded,
      err,
      success
    } = this.props;
    const {name, app} = this.props.params;
    const styles = require('../css/customize.less');
    const contentsClass = loading ? styles.loading :
                          loaded ? styles.loaded : '';
    const {fetcher} = this.context;
    const targets = attributes
      .filter(attribute => __.find(models, {id: attribute.model.id, name}) ? true : false)
      .filter((attribute) => {
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
    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
        { err ?
          <div className="uk-alert uk-alert-danger">
          {Object.keys(err).map((key) =>
            <div key={key}>
              {key}: {err[key]}
            </div>)}
          </div> : ''}
        { success &&
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
                      app={app}
                      model={name}
                      id={item.id}
                      items={items}
                      initialValues={item}
                      onCreate={values => this.props.create(fetcher, app, name, values, index)}
                      onUpdate={(id, values) => this.props.update(fetcher, app, name, id, values, targets, index)}
                      onDelete={id => this.props.delete(fetcher, app, name, id)}
                      err={err && index === this.props.index ? err : undefined}
                    />)
                  )
                }
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="8" className={styles['cm-row-plus']} >
                    <button className={'uk-button ' + styles['cm-row-plus']} onClick={event => {
                      event.preventDefault(); // prevent form submission
                      this.props.add();
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
