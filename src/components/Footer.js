import React, {Component} from 'react';

export default class Footer extends Component {
  render() {
    const styles = require('../css/customize.less');
    return (
      <footer className={'uk-grid uk-container-center uk-text-center ' + styles['cm-footer']} >
        <div className="uk-container uk-container-center uk-text-center uk-width-1-1" >
          <div className="uk-panel">
            <p>
              Made by sideroad
            </p>
            <p>
              Licensed under MIT license.
            </p>
          </div>
        </div>
      </footer>
    );
  }
}
