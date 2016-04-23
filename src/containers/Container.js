import React, {Component, PropTypes} from 'react';

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
