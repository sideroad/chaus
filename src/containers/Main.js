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
    context: PropTypes.string,
    lang: PropTypes.string.isRequired
  }

  render() {
    const {
      children,
      models,
      open,
      context,
      modelName,
      app,
      lang
    } = this.props;

    const styles = require('../css/customize.less');
    return (
      <div>
        {context && app ? <Sidebar models={models} open={open} context={context} modelName={modelName} app={app} lang={lang} /> : ''}
        <div className={styles['cm-main'] + ' ' + (open ? styles['cm-open-main'] : '')} >
          <Header app={app} shouldDisplayToggle={context && app ? true : false} lang={lang} />
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
