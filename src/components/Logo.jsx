import React from 'react';

const styles = require('../css/logo.less');

const Logo = () =>
  <div className={styles.lead}>
    <img
      alt="chaus"
      className={styles.logo}
      src={require('../images/logo.png')}
    />
    <div className={styles.title}>
      <span className={styles.cha} >cha</span>
      <span className={styles.us} >us</span>
    </div>
  </div>;

Logo.propTypes = {
};

export default Logo;
