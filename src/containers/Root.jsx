import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

import { reset } from '../reducers/popup';
import Popup from '../components/Popup';

const Root = props =>
  <div>
    <Popup
      messages={props.messages}
      status={props.status}
      onAnimated={
        () => {
          props.reset();
        }
      }
    />
    {props.children}
  </div>;

Root.propTypes = {
  children: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

Root.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    messages: state.popup.messages,
    status: state.popup.status,
  }),
  {
    reset,
  }
)(Root);

const asynced = asyncConnect([{
  promise: () => {
    const promises = [];
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
