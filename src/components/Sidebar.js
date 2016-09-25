import React, {Component, PropTypes} from 'react';
import { IndexLink } from 'react-router';
import uris from '../uris';

export default class Sidebar extends Component {
  static propTypes = {
    app: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    modelName: PropTypes.string,
    models: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    editing: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired
  };
  componentDidUpdate = () => {
    if ( this.props.editing ) {
      this.refs.name.focus();
    }
  }

  handleAdd = (event)=>{
    event.preventDefault();
    this.props.onAdd();
  }

  handleSubmit = (event)=>{
    event.preventDefault();
    const name = this.refs.name.value;
    const app = this.props.app;
    this.props.onSave({
      app,
      name
    });
  }

  handleBlur = () => {
    this.props.onBlur();
  }

  handleClick = (event) => {
    this.props.onBlur();
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
    const styles = {
      base: require('../css/customize.less'),
      sidebar: require('../css/sidebar.less')
    };
    const modelLinkages = models && models.length ?
        models.map((model) => {
          const name = model.name;
          const linkTo = context === 'models' ? uris.normalize(uris.apps.model, {lang, app, name}) :
                         context === 'data' ? uris.normalize(uris.apps.records, {lang, app, name}) : '';
          const className = model.name === modelName ? 'uk-active ' + styles.sidebar.active : '';
          return (
            <li key={name} className={className} >
              <IndexLink to={linkTo} className={styles.sidebar.link} onClick={this.handleClick} >
                {name}
              </IndexLink>
            </li>
          );
        }) : '';

    return (
      <div className={'uk-width-medium-2-10 ' + styles.sidebar.sidebar + ' ' + ( open ? styles.sidebar.open : '' ) }>
        <div className={styles.sidebar.box}>
          <ul className="uk-nav uk-nav-side">
            <li className={'uk-nav-header ' + styles.sidebar.header + ' ' + styles.sidebar.lead + ' ' + styles.base['cm-title']}>
              {app}
            </li>
            <li className={'uk-nav-header ' + styles.sidebar.header + ' ' + ( context === 'models' && !modelName ? styles.sidebar.active : '')} >
              <IndexLink to={uris.normalize(uris.apps.models, {lang, app})} className={styles.sidebar.link + ' ' + styles.base['cm-nav-header-link']} >
                <i className={'uk-icon-small uk-icon-cubes ' + styles.base['cm-icon']} />Models
              </IndexLink>
            </li>
            {context === 'models' && modelLinkages ? <li className="uk-nav-divider"></li> : ''}
            {context === 'models' && modelLinkages}
            {context === 'models' &&
            (<li className={editing ? styles.base.show : styles.base.hide}>
              <form onSubmit={this.handleSubmit} className="uk-form" >
                <input className={styles.sidebar.input + ' ' + styles.base['cm-input']} type="text" ref="name" placeholder="Model name" onBlur={this.handleBlur} />
              </form>
            </li>)}
            {context === 'models' &&
            (<li className={editing || context !== 'models' ? styles.base.hide : styles.base.show}>
              <a href="#" onClick={this.handleAdd} className={styles.base['cm-nav-plus'] + ' ' + styles.sidebar.link} ><i className="uk-icon-plus"></i></a>
            </li>)}
            {context === 'models' && modelLinkages ? <li className="uk-nav-divider"></li> : ''}
            <li className={'uk-nav-header ' + styles.sidebar.header + ' ' + ( context === 'data' && !modelName ? styles.sidebar.active : '')} >
              <IndexLink to={uris.normalize(uris.apps.data, {lang, app})} className={styles.sidebar.link + ' ' + styles.base['cm-nav-header-link']} >
                <i className={'uk-icon-small uk-icon-database ' + styles.base['cm-icon']} />Data
              </IndexLink>
            </li>
            {context === 'data' && modelLinkages ? <li className="uk-nav-divider"></li> : ''}
            {context === 'data' && modelLinkages}
            {context === 'data' && modelLinkages ? <li className="uk-nav-divider"></li> : ''}
            <li className={'uk-nav-header ' + styles.sidebar.header + ' ' + ( context === 'configs' ? styles.sidebar.active : '' )} >
              <IndexLink
                to={uris.normalize(uris.apps.configs, {lang, app})}
                className={styles.sidebar.link + ' ' + styles.base['cm-nav-header-link']}
                onClick={this.handleClick}>
                  <i className={'uk-icon-small uk-icon-cog ' + styles.base['cm-icon'] } />Settings
              </IndexLink>
            </li>
            <li className={'uk-nav-header ' + styles.sidebar.header} >
              <a className={styles.sidebar.link + ' ' + styles.base['cm-nav-header-link']} href={uris.normalize(uris.apps.docs, {app})}>
                <i className={'uk-icon-small uk-icon-book ' + styles.base['cm-icon'] } />API Doc
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
