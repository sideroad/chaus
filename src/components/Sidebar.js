import React, {Component, PropTypes} from 'react';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import * as modelsActions from 'redux/modules/models';
import * as pageActions from 'redux/modules/page';

import {initializeWithKey} from 'redux-form';
import { routeActions } from 'react-router-redux';

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
    initializeWithKey,
    finishLoad: pageActions.finishLoad,
    closeSidebar: pageActions.closeSidebar,
    push: routeActions.push
  }
)
export default class Sidebar extends Component {
  static propTypes = {
    app: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    modelName: PropTypes.string,
    push: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired,
    saveAdd: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    editing: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    finishLoad: PropTypes.func.isRequired,
    closeSidebar: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired
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
    const app = this.props.app;
    const lang = this.props.lang;
    if (name) {
      this.props.closeSidebar();
      this.props.loadPage();
      this.refs.name.value = '';
      this.props.saveAdd(app, name).then(()=>{
        this.props.finishLoad();
        this.props.push('/apps/' + lang + '/' + app + '/models/' + name );
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
    const {
      models,
      editing,
      open,
      modelName,
      context,
      app
    } = this.props;
    const lang = this.props.lang;
    const styles = require('../css/customize.less');
    const modelLinkages = models && models.length ?
        models.map((model) => {
          const linkTo = '/apps/' + lang + '/' + app + '/' + context + '/' + model.name;
          const className = model.name === modelName ? 'uk-active ' + styles['cm-sidebar-active'] : '';
          return (
            <li key={model.name} className={className} >
              <IndexLink to={linkTo} className={styles['cm-sidebar-link']} onClick={this.handleClick} >
                {model.name}
              </IndexLink>
            </li>
          );
        }) : '';

    return (
      <div className={'uk-width-medium-2-10 ' + styles['cm-sidebar'] + ' ' + ( open ? styles['cm-open-sidebar'] : '' ) }>
        <div className={styles['cm-sidebar-box']}>
          <ul className="uk-nav uk-nav-side">
            <li className={'uk-nav-header ' + styles['cm-nav-header'] + ' ' + ( context === 'models' && !modelName ? styles['cm-sidebar-active'] : '')} >
              <IndexLink to={'/apps/' + lang + '/' + app + '/models'} className={styles['cm-sidebar-link'] + ' ' + styles['cm-nav-header-link']} >
                <i className={'uk-icon-small uk-icon-cubes ' + styles['cm-icon']} />Models
              </IndexLink>
            </li>
            {context === 'models' && modelLinkages ? <li className="uk-nav-divider"></li> : ''}
            {context === 'models' && modelLinkages}
            {context === 'models' &&
            (<li className={editing ? styles.show : styles.hide}>
              <form onSubmit={this.handleSubmit} className="uk-form" >
                <input className={styles['cm-nav-input'] + ' ' + styles['cm-input']} type="text" ref="name" placeholder="Model name" onBlur={this.handleBlur} />
              </form>
            </li>)}
            {context === 'models' &&
            (<li className={editing || context !== 'models' ? styles.hide : styles.show}>
              <a href="#" onClick={this.handleAdd} className={styles['cm-nav-plus'] + ' ' + styles['cm-sidebar-link']} ><i className="uk-icon-plus"></i></a>
            </li>)}
            {context === 'models' && modelLinkages ? <li className="uk-nav-divider"></li> : ''}
            <li className={'uk-nav-header ' + styles['cm-nav-header'] + ' ' + ( context === 'data' && !modelName ? styles['cm-sidebar-active'] : '')} >
              <IndexLink to={'/apps/' + lang + '/' + app + '/data'} className={styles['cm-sidebar-link'] + ' ' + styles['cm-nav-header-link']} >
                <i className={'uk-icon-small uk-icon-database ' + styles['cm-icon']} />Data
              </IndexLink>
            </li>
            {context === 'data' && modelLinkages ? <li className="uk-nav-divider"></li> : ''}
            {context === 'data' && modelLinkages}
            {context === 'data' && modelLinkages ? <li className="uk-nav-divider"></li> : ''}
            <li className={'uk-nav-header ' + styles['cm-nav-header'] + ' ' + ( context === 'configs' ? styles['cm-sidebar-active'] : '' )} >
              <IndexLink
                to={'/apps/' + lang + '/' + app + '/config'}
                className={styles['cm-sidebar-link'] + ' ' + styles['cm-nav-header-link']}
                onClick={this.handleClick}>
                  <i className={'uk-icon-small uk-icon-cog ' + styles['cm-icon'] } />Settings
              </IndexLink>
            </li>
            <li className={'uk-nav-header ' + styles['cm-nav-header']} >
              <a className={styles['cm-sidebar-link'] + ' ' + styles['cm-nav-header-link']} href={'/docs/' + app}>
                <i className={'uk-icon-small uk-icon-book ' + styles['cm-icon'] } />API Doc
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
