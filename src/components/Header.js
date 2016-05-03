import React, {Component, PropTypes} from 'react';
import {IndexLink} from 'react-router';
import { connect } from 'react-redux';
import * as pageActions from 'redux/modules/page';


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
    app: PropTypes.string,
    toggleSidebar: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired
  };

  render() {
    const {toggleSidebar, shouldDisplayToggle, app, lang, open} = this.props;
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
          <nav className={'uk-navbar ' + styles.base['cm-navbar']}>
            {shouldDisplayToggle ?
              <a className={'uk-navbar-toggle uk-visible-small ' + ( open ? styles.header.open : styles.header.close)} onClick={handleClick} ></a> :
              ''}
            <div className="uk-navbar-brand uk-navbar-center uk-visible-small" >
              <IndexLink to={'/' + lang + '/apps'} className={styles.base['cm-logo-small']}>
                <img src="/images/logo.png" />
              </IndexLink>
            </div>
            <ul className="uk-navbar-nav uk-container uk-container-center uk-hidden-small">
                <li className={'uk-active ' + styles.base['cm-nav-active']}>
                  <IndexLink to={'/' + lang + '/apps'} className={styles.base['cm-logo']}>
                    <img src="/images/logo.png" /> chaus
                  </IndexLink>
                </li>
            </ul>
            <div className={'uk-navbar-center uk-navbar-content uk-hidden-small ' + styles.header.title}>
              {app}
            </div>
          </nav>
        </div>
      </header>
    );
  }
}
