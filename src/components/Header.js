import React, {Component, PropTypes} from 'react';
import {IndexLink} from 'react-router';
import { connect } from 'react-redux';
import * as pageActions from 'redux/modules/page';
import uris from '../uris';

@connect(
  state => ({
    open: state.page.open
  }),
  {...pageActions}
)
export default class Header extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    shouldDisplayToggle: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired
  };

  render() {
    const {toggleSidebar, shouldDisplayToggle, lang, open} = this.props;
    const styles = {
      base: require('../css/customize.less'),
      header: require('../css/header.less')
    };

    const handleClick = (event) => {
      event.preventDefault();
      toggleSidebar();
    };

    return (
      <header className="uk-grid" >
        <div className="uk-width-1-1">
          <div className={styles.header.circle}></div>
          <nav className={'uk-navbar ' + styles.header.nav}>
            {shouldDisplayToggle ?
              <a className={'uk-navbar-toggle uk-visible-small ' + ( open ? styles.header.open : styles.header.close)} onClick={handleClick} ></a> :
              ''}
            <div className="uk-navbar-brand uk-navbar-center uk-visible-small" >
              <IndexLink to={uris.normalize(uris.apps.apps, {lang})} className={styles.header.logosmall}>
                <img src="/images/logo.png" />
              </IndexLink>
            </div>
            <ul className="uk-navbar-center uk-hidden-small">
                <li className={styles.header.lead}>
                  <IndexLink to={uris.normalize(uris.apps.apps, {lang})} className={styles.header.logo}>
                    <img src="/images/logo.png" />
                    <span>chaus</span>
                  </IndexLink>
                </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}
