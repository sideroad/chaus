import React, {Component} from 'react';

export default class Footer extends Component {
  render() {
    const styles = {
      base: require('../css/customize.less'),
      footer: require('../css/footer.less')
    };
    return (
      <footer className={'uk-grid uk-container-center uk-text-center ' + styles.base['cm-footer']} >
        <div className="uk-container uk-container-center uk-text-center uk-width-1-1" >
          <div className={'uk-panel ' + styles.footer.copyright}>
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
