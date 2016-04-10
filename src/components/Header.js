import React, {Component, PropTypes} from 'react';
import {IndexLink} from 'react-router';
import { connect } from 'react-redux';
import * as pageActions from 'redux/modules/page';


@connect(
  state => ({
    restart: state.page.restart
  }),
  {...pageActions}
)
export default class Header extends Component {
  static propTypes = {
    shouldDisplayToggle: PropTypes.bool.isRequired,
    restart: PropTypes.func.isRequired,
    app: PropTypes.string,
    toggleSidebar: PropTypes.func.isRequired
  };

  render() {
    const {restart, toggleSidebar, shouldDisplayToggle, app} = this.props;
    const styles = require('../css/customize.less');

    const handleClick = (event) => {
      event.preventDefault();
      toggleSidebar();
    };

    const handleRestart = (event)=> {
      event.preventDefault();
      restart();
    };

    // TODO: [Enhance]Add configuration below
    //       - API description ( for API doc )
    //       - CORS domains
    return (
      <header className="uk-grid" >
        <div className="uk-width-1-1">
          <nav className={'uk-navbar ' + styles['cm-navbar']}>
            {shouldDisplayToggle ? <a className="uk-navbar-toggle uk-visible-small" onClick={handleClick} ></a> : ''}
            <div className="uk-navbar-brand uk-navbar-center uk-visible-small" >
              <IndexLink to="/apps" className={styles['cm-logo-small']}>
                <img src="/images/logo.png" />
              </IndexLink>
            </div>
            <div className="uk-navbar-flip uk-hidden-small">
                <ul className="uk-navbar-nav">
                  <li><a href="#" className={styles['cm-navlink']} onClick={handleRestart}><i className="uk-icon-refresh uk-icon-medium"></i></a></li>
                </ul>
            </div>
            <ul className="uk-navbar-nav uk-container uk-container-center uk-hidden-small">
                <li className={'uk-active ' + styles['cm-nav-active']}>
                  <IndexLink to="/apps" className={styles['cm-logo']}>
                    <img src="/images/logo.png" /> chaus
                  </IndexLink>
                </li>
            </ul>
            <div className={'uk-navbar-center uk-navbar-content uk-hidden-small ' + styles['cm-app-title']}>
              {app}
            </div>
          </nav>
        </div>
      </header>
    );
  }
}
