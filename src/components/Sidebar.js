import React, {Component, PropTypes} from 'react';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import * as modelsActions from 'redux/modules/models';
import * as pageActions from 'redux/modules/page';
import {initializeWithKey} from 'redux-form';

@connect(
  (state) => ({
    add: state.models.add,
    save: state.models.save,
    cancel: state.models.cancel,
    editing: state.models.editing
  }),
  {
    ...modelsActions,
    loadPage: pageActions.load,
    finishLoad: pageActions.finishLoad,
    initializeWithKey,
    closeSidebar: pageActions.closeSidebar
  }
)
export default class Sidebar extends Component {
  static propTypes = {
    context: PropTypes.string.isRequired,
    name: PropTypes.string,
    models: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired,
    saveAdd: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    editing: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    finishLoad: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    closeSidebar: PropTypes.func.isRequired
  };
  componentDidUpdate = () => {
    if ( this.props.editing ) {
      this.refs.name.focus();
    }
  }

  handleAdd = (event)=>{
    event.preventDefault();
    this.props.add();
  }

  handleSubmit = (event)=>{
    event.preventDefault();
    const name = this.refs.name.value;
    if (name) {
      this.props.loadPage();
      this.refs.name.value = '';
      this.props.saveAdd(name).then(()=>{
        this.props.finishLoad();
      });
    }
  }

  handleBlur = () => {
    this.props.cancel();
  }

  handleClick = (event) => {
    this.props.closeSidebar();
    event.target.blur();
  }

  render() {
    const {models, editing, open, name, context} = this.props;
    const styles = require('../css/customize.less');
    const modelLinkages = models && models.length &&
      models.map((model) => {
        const linkTo = '/' + context + '/models/' + model.name;
        const className = model.name === name ? 'uk-active ' + styles['cm-sidebar-active'] : '';
        return (
          <li key={model.name} className={className} >
            <IndexLink to={linkTo} className={styles['cm-sidebar-link']} onClick={this.handleClick} >
              {model.name}
            </IndexLink>
          </li>
        );
      })
    || ' ';

    return (
      <div className={'uk-width-medium-2-10 ' + styles['cm-sidebar'] + ' ' + ( open ? styles['cm-open-sidebar'] : '' ) }>
        <div className={styles['cm-sidebar-box']}>
          <ul className="uk-nav uk-nav-side">
            <li className={'uk-nav-header ' + styles['cm-nav-header']} >
              <IndexLink to="/admin" className={styles['cm-sidebar-link'] + ' ' + styles['cm-nav-header-link']} onClick={this.handleClick} >
                <i className={'uk-icon-small uk-icon-cubes ' + styles['cm-icon'] } />admin
              </IndexLink>
            </li>
            <li className="uk-nav-divider"></li>
            {context === 'admin' && modelLinkages}
            {context === 'admin' &&
            (<li className={editing ? styles.show : styles.hide}>
              <form onSubmit={this.handleSubmit} className="uk-form" >
                <input className={styles['cm-nav-input']} type="text" ref="name" placeholder="Model name" onBlur={this.handleBlur} />
              </form>
            </li>)}
            {context === 'admin' &&
            (<li className={editing || context !== 'admin' ? styles.hide : styles.show}>
              <a href="#" onClick={this.handleAdd} className={styles['cm-nav-plus'] + ' ' + styles['cm-sidebar-link']} ><i className="uk-icon-plus"></i></a>
            </li>)}
            {context === 'admin' && <li className="uk-nav-divider"></li>}
            <li className={'uk-nav-header ' + styles['cm-nav-header']} >
              <IndexLink to="/data" className={styles['cm-sidebar-link'] + ' ' + styles['cm-nav-header-link']} onClick={this.handleClick} >
                <i className={'uk-icon-small uk-icon-database ' + styles['cm-icon'] } />data
              </IndexLink>
            </li>
            {context === 'data' && <li className="uk-nav-divider"></li>}
            {context === 'data' && modelLinkages}
            <li className="uk-nav-divider"></li>
            <li className={'uk-nav-header ' + styles['cm-nav-header']} >
              <a className={styles['cm-sidebar-link'] + ' ' + styles['cm-nav-header-link']} href="/doc/">
                <i className={'uk-icon-small uk-icon-book ' + styles['cm-icon'] } />API Doc
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
