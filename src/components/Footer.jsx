import React from 'react';
import Logo from '../components/Logo';

const styles = require('../css/footer.less');

const Footer = () =>
  <div
    className={styles.footer}
  >
    <div className={styles.logo} >
      <Logo />
    </div>
    <div className={styles.year}>
      , 2016
    </div>
  </div>;

Footer.propTypes = {
};

export default Footer;
