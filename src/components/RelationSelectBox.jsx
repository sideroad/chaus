import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { Field } from 'redux-form';
import __ from 'lodash';

import styles from '../css/relation-selectbox.less';

const RelationSelectBox = props =>
  <p className={styles.parent}>
    {
      props.attributes.length ?
        <Field
          className={styles.selectbox}
          component="select"
          name={`${props.attribute}.relationAttribute`}
        >
          {
            props.attributes
              .filter(item => __.find(props.models, { id: item.model.id, name: props.model }))
              .map(item => ({
                ...item,
                relation: item.relation ? item.relation.id : ''
              }))
              .map(item =>
                <option value={item.name} key={item.name} >{item.name}</option>
              )
          }
        </Field>
      : ''
    }
  </p>;

RelationSelectBox.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  models: PropTypes.array.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  model: PropTypes.string.isRequired,
  attribute: PropTypes.string.isRequired,
  attributes: PropTypes.array.isRequired
};

const connected = connect(
  state => ({
    attributes: state.attributes.data,
    models: state.models.data
  }),
  {}
)(RelationSelectBox);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher }, params }) =>
    fetcher.attributes.load({
      app: params.app
    })
}])(connected);

export default asynced;
