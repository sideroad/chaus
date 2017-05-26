import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Logo from '../components/Logo';
import fa from '../css/koiki-ui/fa/less/font-awesome.less';

const styles = require('../css/header.less');

const Header = props =>
  <div
    className={`${styles.header} ${props.open ? styles.open : ''}`}
  >
    {
      props.toggle ?
        <button
          className={styles.bars}
          onClick={props.toggle}
        >
          <i className={`${fa.fa} ${fa['fa-bars']}`} />
        </button>
      : ''
    }
    <Link to={props.url}>
      <div className={styles.logo} >
        <Logo />
      </div>
    </Link>
  </div>;

Header.propTypes = {
  url: PropTypes.string.isRequired,
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

Header.defaultProps = {
  open: false
};

export default Header;
