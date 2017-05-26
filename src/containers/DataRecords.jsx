import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { asyncConnect } from 'redux-connect';
import pluralize from 'pluralize';
import __ from 'lodash';
import * as recordActions from '../reducers/records';
import RecordForm from '../components/RecordForm';
import * as pageActions from '../reducers/page';
import fa from '../css/koiki-ui/fa/less/font-awesome.less';

const styles = require('../css/data-records.less');

const DataRecords = (props, context) => {
  const targets = props.attributes
    .filter(attribute => __.find(props.models, { id: attribute.model.id, name: props.name }))
    .filter(attribute => attribute.type !== 'children');

  const items = props.records.map((record) => {
    const values = {};
    targets.forEach((attribute) => {
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
  const fields = targets.map(attribute => attribute.name).concat(['model']);
  return (
    <div>
      {
        props.err ?
          <div className={`${styles.popup} ${styles.error}`}>
            {
              Object.keys(props.err).map(key => console.log(props.err) ||
                <div key={key}>
                  {key}: {props.err[key]}
                </div>
              )
            }
          </div>
        : ''
      }
      {
        props.success ?
          <div className={`${styles.popup} ${styles.success}`}>
            Record has been updated successfully.
          </div>
        : ''
      }
      <div className={styles.header}>
        <h1 className={styles.lead} >{props.name}</h1>
      </div>
      <form>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>id</th>
              {
                targets.map(attribute => <th key={attribute.name}>{attribute.name}</th>)
              }
              <th />
            </tr>
          </thead>
          <tbody>
            {
              items.map((item, index) =>
                <RecordForm
                  form={`${props.name}-${index}`}
                  key={`${props.name}-${index}`}
                  fields={fields}
                  targets={targets}
                  app={props.app}
                  model={props.name}
                  id={item.id}
                  item={item}
                  initialValues={item}
                  onCreate={
                    values =>
                      props.create(
                        context.fetcher,
                        props.app,
                        props.headers,
                        props.name,
                        values,
                        index
                      )
                  }
                  onUpdate={
                    (id, values) =>
                      props.update(
                        context.fetcher,
                        props.app,
                        props.headers,
                        props.name,
                        id,
                        values,
                        targets,
                        index
                      )
                  }
                  onDelete={
                    id =>
                      props.delete(
                        context.fetcher,
                        props.app,
                        props.headers,
                        props.name,
                        id
                      )
                  }
                  err={props.err && index === props.index ? props.err : undefined}
                />
              )
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={targets.length + 2} >
                <button
                  className={styles.plus}
                  onClick={(event) => {
                    event.preventDefault();
                    props.add();
                  }}
                >
                  <i className={`${fa.fa} ${fa['fa-plus']}`} />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    </div>
  );
};

DataRecords.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  headers: PropTypes.object.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  models: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
  records: PropTypes.array.isRequired,
  err: PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  index: PropTypes.number,
  success: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  create: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  update: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  delete: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  app: PropTypes.string.isRequired,
};

DataRecords.contextTypes = {
  fetcher: PropTypes.object.isRequired
};

const connected = connect(
  (state, ownProps) => ({
    models: state.models.data,
    attributes: state.attributes.data,
    loaded: state.attributes.loaded,
    loading: state.attributes.loading,
    records: state.records.data,
    headers: {
      'x-chaus-secret': state.configs.data.secret,
      'x-chaus-client': state.configs.data.client,
    },
    err: state.records.err,
    index: state.records.index,
    success: state.records.success,
    name: ownProps.params.name,
    app: ownProps.params.app,
  }),
  dispatch => ({
    add: () => dispatch(recordActions.add()),
    delete: (fetcher, app, headers, model, id) => {
      if (!id) {
        dispatch(recordActions.pop());
        return;
      }
      dispatch(pageActions.load());
      fetcher.records
        .delete({
          app,
          model: pluralize(model),
          id
        }, { headers })
        .then(
          () =>
          fetcher.records
            .load({
              app,
              model: pluralize(model)
            }, { headers })
        )
        .then(
          () => dispatch(pageActions.finishLoad())
        )
        .catch(
          () => dispatch(pageActions.finishLoad())
        );
    },
    create: (fetcher, app, headers, model, values, index) => {
      dispatch(pageActions.load());
      fetcher.records
        .create({
          ...values,
          app,
          model: pluralize(model)
        }, { headers })
        .then(
          () =>
          fetcher.records
            .load({
              app,
              model: pluralize(model)
            }, { headers })
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
    update: (fetcher, app, headers, model, id, values, targets, index) => {
      dispatch(pageActions.load());
      const updates = {};
      targets.forEach((attribute) => {
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
        }, { headers })
        .then(
          () =>
          fetcher.records
            .load({
              app,
              model: pluralize(model)
            }, { headers })
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
)(DataRecords);

const asynced = asyncConnect([{
  promise: ({ params, helpers: { fetcher }, store }) => {
    const promises = [];
    const state = store.getState();
    promises.push(fetcher.models.load({
      app: params.app
    }));
    promises.push(fetcher.attributes.load({
      app: params.app
    }));
    promises.push(fetcher.records.load({
      app: params.app,
      model: pluralize(params.name)
    }, {
      headers: {
        'x-chaus-secret': state.configs.data.secret,
        'x-chaus-client': state.configs.data.client,
      }
    }));
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
