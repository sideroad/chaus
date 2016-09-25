import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import * as pageActions from 'modules/page';

@connect(
  (state) => ({
    loading: state.page.loading
  }),
  {...pageActions}
)
export default class ModalLoading extends Component {
  static propTypes = {
    loading: PropTypes.bool
  };

  render() {
    const {loading} = this.props;
    const styles = require('../css/customize.less');
    const img = require('../images/simple.png');
    return (
      <div className={'uk-modal ' + ( loading ? 'uk-open ' + styles['cm-modal-open'] : '')} >
        <div className={styles['cm-moon-outer']} >
          <div className={loading ? styles['cm-moon'] : ''} >
            <div className={loading ? styles['cm-moon-child'] + ' ' + styles['cm-moon-child-first'] : ''} />
            <div className={loading ? styles['cm-moon-child'] + ' ' + styles['cm-moon-child-second'] : ''} />
            <div className={loading ? styles['cm-moon-child'] + ' ' + styles['cm-moon-child-third'] : ''} />
            <div className={loading ? styles['cm-moon-child'] + ' ' + styles['cm-moon-child-fourth'] : ''} />
            <img src={img} className={loading ? styles['cm-moon-rabbit'] : ''} />
          </div>
        </div>
      </div>
    );
  }
}
