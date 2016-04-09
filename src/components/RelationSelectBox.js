import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {load} from 'redux/modules/attributes';
import * as relationActions from 'redux/modules/relations';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch}, params}) => {
    return dispatch(load(params.app));
  }
}])
@connect(
  (state) => ({
    attributes: state.attributes.data
  }),
  {...relationActions}
)
export default class RelationSelectBox extends Component {
  static propTypes = {
    model: PropTypes.string.isRequired,
    relation: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired
  };

  render() {
    const {
      model,
      relation,
      attributes
    } = this.props;
    const styles = require('../css/customize.less');

    return (
      <p className={styles['cm-parent-attribution']}>
      {attributes[model] &&
        <select name="relation" {...relation} value={relation.value}>
          {attributes[model].map(_relation => <option value={_relation.name} key={_relation.name} >{_relation.name}</option>)}
        </select>
      }
      </p>
    );
  }
}
