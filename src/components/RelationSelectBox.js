import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-connect';
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
    relation: PropTypes.object.isRequired,
    attributes: PropTypes.array.isRequired
  };

  render() {
    const {
      models,
      model,
      relation,
      attributes
    } = this.props;
    const styles = require('../css/customize.less');

    return (
      <p className={styles['cm-parent-attribution']}>
      {attributes.length &&
        <select name="relation" className={styles['cm-selectbox']} {...relation} value={relation.value}>
          {attributes
            .map(attribute => {
              const _attribute = Object.assign({}, attribute);
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
            .filter(attribute => attribute ? true : false)
            .map(_relation =>
              <option value={_relation.name} key={_relation.name} >{_relation.name}</option>
            )}
        </select>
      }
      </p>
    );
  }
}
