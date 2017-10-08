import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = require('../css/popup.less');

class Popup extends Component {
  componentDidMount() {
    this.popup.addEventListener('animationend', () =>
      this.props.onAnimated()
    );
  }

  render() {
    return (
      <div
        ref={(elem) => { this.popup = elem; }}
        className={`${styles.popup} ${styles[this.props.status]}`}
      >
        {
          this.props.messages.map(message => console.log(message) ||
            <div key={message}>
              {message}
            </div>
          )
        }
      </div>
    );
  }
}

Popup.propTypes = {
  messages: PropTypes.array.isRequired,
  status: PropTypes.oneOf(['success', 'error', 'none']).isRequired,
  onAnimated: PropTypes.func,
};

Popup.defaultProps = {
  onAnimated: () => {},
};

export default Popup;
