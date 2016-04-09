import React, {Component, PropTypes} from 'react';
import {Header, Sidebar, Footer, ModalLoading} from 'components';
import { connect } from 'react-redux';
import * as pageActions from 'redux/modules/page';

@connect(
  () => ({}),
  {
    closeSidebar: pageActions.closeSidebar
  }
)
export default class Main extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    models: PropTypes.array,
    open: PropTypes.bool,
    modelName: PropTypes.string,
    app: PropTypes.string,
    closeSidebar: PropTypes.func.isRequired,
    context: PropTypes.string
  }

  render() {
    const {
      children,
      models,
      open,
      context,
      modelName,
      app
    } = this.props;

    const styles = require('../css/customize.less');
    return (
      <div>
        {context && app ? <Sidebar models={models} open={open} context={context} modelName={modelName} app={app}/> : ''}
        <div className={styles['cm-main'] + ' ' + (open ? styles['cm-open-main'] : '')} >
          <Header shouldDisplayToggle={context && app ? true : false} />
          <div className={context && app ? 'uk-grid uk-container ' + styles['cm-grid'] : ''} onClick={this.props.closeSidebar} >
            {children}
          </div>
          <Footer />
          <ModalLoading />
        </div>
      </div>
    );
  }
}
