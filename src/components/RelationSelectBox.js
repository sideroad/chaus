import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { Field } from 'redux-form';
import __ from 'lodash';

@asyncConnect([{
  promise: ({helpers: {fetcher}, params}) => {
    return fetcher.attributes.load({
      app: params.app
    });
  }
}])
@connect(
  (state) => ({
    attributes: state.attributes.data,
    models: state.models.data
  }),
  {}
)
export default class RelationSelectBox extends Component {
  static propTypes = {
    models: PropTypes.array.isRequired,
    model: PropTypes.string.isRequired,
    relation: PropTypes.string,
    attribute: PropTypes.string.isRequired,
    attributes: PropTypes.array.isRequired
  };

  render() {
    const {
      models,
      model,
      attribute,
      attributes
    } = this.props;
    const styles = require('../css/customize.less');

    return (
      <p className={styles['cm-parent-attribution']}>
      {attributes.length &&
        <Field
          className={styles['cm-selectbox']}
          component="select"
          name={`${attribute}.relationAttribute`}
        >
          {attributes
            .map(item => {
              const _attribute = Object.assign({}, item);
              if ( _attribute.relation ) {
                _attribute.relation = _attribute.relation.id;
              }
              const _model = __.find(models, {id: _attribute.model.id, name: model});
              if ( !_model ) {
                return false;
              }
              _attribute.model = _model;
              return _attribute;
            })
            .filter(_attribute => _attribute ? true : false)
            .map(_relation =>
              <option value={_relation.name} key={_relation.name} >{_relation.name}</option>
            )}
        </Field>
      }
      </p>
    );
  }
}
