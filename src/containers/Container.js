import React, {Component, PropTypes} from 'react';
import {load} from 'redux/modules/i18n';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch}, params}) => {
    return dispatch(load(params.lang));
  }
}])
export default class Apps extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
