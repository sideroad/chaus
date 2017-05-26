import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Loading = (props) => {
  const styles = require('../css/loading.less');
  const img = require('../images/simple.png');

  return (
    <div className={`${styles.modal} ${props.loading ? styles.open : ''}`} >
      <div className={styles.outer} >
        <div className={styles.moon} >
          <div className={`${styles.child} ${styles.first}`} />
          <div className={`${styles.child} ${styles.second}`} />
          <div className={`${styles.child} ${styles.third}`} />
          <div className={`${styles.child} ${styles.fourth}`} />
          <img src={img} className={styles.rabbit} alt="" />
        </div>
      </div>
    </div>
  );
};

Loading.propTypes = {
  loading: PropTypes.bool
};

const connected = connect(
  state => ({
    loading: state.page.loading
  })
)(Loading);

export default connected;
