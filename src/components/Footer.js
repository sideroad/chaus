import React, {Component} from 'react';

export default class Footer extends Component {
  render() {
    const styles = {
      base: require('../css/customize.less'),
      footer: require('../css/footer.less')
    };
    return (
      <footer className={styles.footer.footer} >
        <div>
          <div className={styles.footer.copyright}>
            <div className={styles.footer.cloud1}></div>
            <div className={styles.footer.cloudhide1}></div>
            <div className={styles.footer.cloudconnect1}></div>
            <div className={styles.footer.cloudhide2}></div>
            <div className={styles.footer.cloud2}></div>
            <p>
              Made by sideroad.<br/>
              Licensed under MIT license.
            </p>
            <div className={styles.footer.cloud3}></div>
            <div className={styles.footer.cloudhide3}></div>
            <div className={styles.footer.cloudconnect2}></div>
            <div className={styles.footer.cloudhide4}></div>
            <div className={styles.footer.cloud4}></div>
          </div>
        </div>
      </footer>
    );
  }
}
