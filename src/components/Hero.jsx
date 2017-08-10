import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'koiki-ui';
import Logo from '../components/Logo';
import config from '../config';

const requiredLogin = config.github.enabled;
const styles = require('../css/hero.less');

const Hero = props =>
  <div
    className={styles.hero}
  >
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.sublead}>
        Dead Simple REST API
      </div>
      <div className={styles.describe}>
        Create your resources in 1 minute
      </div>
      <div className={styles.login}>
        <Button
          styles={{
            fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
            button: require('../css/koiki-ui/button.less')
          }}
          icon={requiredLogin ? 'fa-github' : ''}
          text="Get Started"
          onClick={props.onLogin}
        />
      </div>
    </div>
  </div>;

Hero.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Hero;
