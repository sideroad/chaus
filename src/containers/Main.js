import React, {Component, PropTypes} from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ModalLoading from '../components/ModalLoading';
import { connect } from 'react-redux';
import * as pageActions from '../reducers/page';
import * as modelsActions from '../reducers/models';
import { push } from 'react-router-redux';
import uris from '../uris';
import { stringify } from 'koiki';

class Main extends Component {

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
    const {fetcher} = this.context;
    const styles = require('../css/customize.less');
    return (
      <div>
        {context && app ?
          <Sidebar
            models={models}
            open={open}
            context={context}
            modelName={modelName}
            app={app}
            lang={lang}
            editing={this.props.editing}
            onBlur={this.props.cancel}
            onAdd={this.props.add}
            onSave={values => this.props.save(fetcher, values, lang)}
          /> :
          ''
        }
        <div
          className={styles['cm-main'] + ' ' + (open ? styles['cm-open-main'] : '')}
        >
          <Header
            shouldDisplayToggle={context && app ? true : false}
            lang={lang}
          />
          <div
            className={context && app ? 'uk-grid uk-container ' + styles['cm-grid'] : ''}
            onClick={this.props.closeSidebar}
          >
            {children}
          </div>
          <Footer />
          <ModalLoading />
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  children: PropTypes.object.isRequired,
  models: PropTypes.array,
  open: PropTypes.bool,
  modelName: PropTypes.string,
  app: PropTypes.string,
  editing: PropTypes.bool,
  add: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  context: PropTypes.string,
  lang: PropTypes.string.isRequired
};

Main.contextTypes = {
  fetcher: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    editing: state.models.editing
  }),
  dispatch => ({
    cancel: () => dispatch(modelsActions.cancel()),
    add: () => dispatch(modelsActions.add()),
    save: (fetcher, values, lang) => {
      if (values.name) {
        dispatch( pageActions.closeSidebar());
        dispatch( pageActions.load());
        fetcher.models.save(values).then(()=>{
          fetcher.models.load({
            app: values.app
          }).then(() => {
            dispatch( pageActions.finishLoad());
            dispatch( push(stringify(uris.pages.model, {lang, app: values.app, name: values.name})));
          });
        });
      }
    },
    closeSidebar: () => dispatch( pageActions.closeSidebar())
  })
)(Main);

export default connected;
