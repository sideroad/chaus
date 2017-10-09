import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { Button } from 'koiki-ui';

import Logo from '../components/Logo';

const styles = require('../css/offline.less');

const Offline = () =>
  <div className={styles.root}>
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.message}>
        Network Connection Failed
      </div>
      <div className={styles.button}>
        <Button
          styles={{
            fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
            button: require('../css/koiki-ui/button.less')
          }}
          text="Reload"
          icon="fa-refresh"
          onClick={() => location.reload()}
        />
      </div>
    </div>
  </div>;

Offline.propTypes = {
};

Offline.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const connected = connect(
  state => state,
  () => ({})
)(Offline);

const asynced = asyncConnect([{
  promise: () => {
    const promises = [];
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
