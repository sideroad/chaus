import React from 'react';
import PropTypes from 'prop-types';
import __ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-connect';
import eachSeries from 'async/mapSeries';
import pluralize from 'pluralize';
import { stringify } from 'koiki';
import { Button } from 'koiki-ui';

import uris from '../uris';
import AttributeForm from '../components/AttributeForm';
import * as pageActions from '../reducers/page';
import * as attributesActions from '../reducers/attributes';
import styles from '../css/resource-attributes.less';
import fa from '../css/koiki-ui/fa/less/font-awesome.less';

const ResourceAttributes = (props, context) =>
  <div>
    {
      props.err ?
        <div className={`${styles.popup} ${styles.error}`}>
          {
            Object.keys(props.err).map(key =>
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
          Resource has been updated successfully.
        </div>
      : ''
    }
    <div className={styles.header}>
      <h1 className={styles.lead} >{props.name}</h1>
      <div className={styles.delete}>
        <Button
          icon="fa-trash"
          text="Delete"
          color="secondary"
          styles={{
            fa,
            button: require('../css/koiki-ui/button.less'),
          }}
          onClick={
            () =>
              props.delete(context.fetcher, props.app, __.find(props.models, {
                name: props.name
              }).id, props.name, props.lang)
          }
        />
      </div>
    </div>
    <AttributeForm
      model={props.name}
      app={props.app}
      initialValues={{
        attributes: props.attributes
          .filter(attribute =>
            __.find(props.models, {
              id: attribute.model.id,
              name: props.name
            })
          )
          .map(attribute => ({
            ...attribute,
            relation: attribute.relation ? attribute.relation.id : '',
          })),
        model: __.find(props.models, { name: props.name }).id
      }}
      relations={props.models}
      onSubmit={values => props.save(context.fetcher, props.app, values)}
      err={props.err}
      index={props.index}
    />
  </div>;

ResourceAttributes.propTypes = {
  models: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
  save: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  delete: PropTypes.func.isRequired,
  err: PropTypes.object,
  index: PropTypes.number,
  success: PropTypes.bool,
  app: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  lang: PropTypes.string.isRequired,
};

ResourceAttributes.contextTypes = {
  fetcher: PropTypes.object.isRequired
};

const connected = connect(
  (state, ownProps) => ({
    models: state.models.data,
    attributes: state.attributes.data,
    loaded: state.attributes.loaded,
    loading: state.attributes.loading,
    err: state.attributes.err,
    index: state.attributes.index,
    success: state.attributes.success,
    name: ownProps.params.name,
    app: ownProps.params.app,
    lang: ownProps.params.lang,
  }),
  dispatch => ({
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
          dispatch(push(stringify(uris.pages.models, { lang, app, model })));
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
        .then(() => {
          let index = 0;
          eachSeries(
            values.attributes,
            (attribute, callback) => {
              fetcher.attributes
                .save({
                  ...attribute,
                  app,
                  model
                })
                .then(
                  // eslint-disable-next-line no-return-assign
                  () => callback(null, index += 1),
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
)(ResourceAttributes);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher }, params }) => {
    const promises = [];

    promises.push(fetcher.models.load({
      app: params.app
    }));
    promises.push(fetcher.attributes.load({
      app: params.app
    }));
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
