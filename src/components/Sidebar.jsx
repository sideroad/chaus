import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';
import autoBind from 'react-autobind';
import { stringify } from 'koiki';
import uris from '../uris';
import styles from '../css/sidebar.less';
import fa from '../css/koiki-ui/fa/less/font-awesome.less';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }
  componentDidUpdate() {
    if (this.props.editing) {
      this.nameDOM.focus();
    }
  }

  handleAdd(event) {
    event.preventDefault();
    this.props.onAdd();
  }

  handleSubmit(event) {
    event.preventDefault();
    const name = this.nameDOM.value;
    const app = this.props.app;
    this.props.onSave({
      app,
      name
    });
  }

  handleBlur() {
    this.props.onBlur();
  }

  handleClick(event) {
    this.props.onBlur();
    this.props.closeSidebar();
    event.target.blur();
  }

  render() {
    const {
      models,
      editing,
      modelName,
      context,
      app
    } = this.props;
    const lang = this.props.lang;

    const modelLinkages = models && models.length ?
        models.map((model) => {
          const name = model.name;
          const linkTo = context === 'models' ? stringify(uris.pages.model, { lang, app, name }) :
                         context === 'data' ? stringify(uris.pages.records, { lang, app, name }) : '';

          return (
            <li key={name} >
              <IndexLink
                to={linkTo}
                className={`${styles.child} ${model.name === modelName ? styles.active : ''}`}
                onClick={this.handleClick}
              >
                {name}
              </IndexLink>
            </li>
          );
        }) : '';

    return (
      <div className={styles.sidebar}>
        <div className={styles.box}>
          <ul className={styles.nav}>
            <li className={styles.lead}>
              {app}
            </li>
            <li>
              <IndexLink
                to={stringify(uris.pages.models, { lang, app })}
                className={`${styles.header} ${context === 'models' && !modelName ? styles.active : ''}`}
              >
                <i className={`${fa.fa} ${fa['fa-cubes']}`} />Models
              </IndexLink>
            </li>
            {context === 'models' && modelLinkages}
            {context === 'models' && editing ?
              <li>
                <form onSubmit={this.handleSubmit} >
                  <input
                    ref={(elem) => { this.nameDOM = elem; }}
                    className={styles.input}
                    type="text"
                    placeholder="Model name"
                    onBlur={this.handleBlur}
                  />
                </form>
              </li>
              : ''
            }
            {context === 'models' && !editing ?
              <li>
                <button onClick={this.handleAdd} className={styles.plus} >
                  <i className={`${fa.fa} ${fa['fa-plus']}`} />
                </button>
              </li>
              : ''
            }
            <li>
              <IndexLink
                to={stringify(uris.pages.data, { lang, app })}
                className={`${styles.header} ${context === 'data' && !modelName ? styles.active : ''}`}
              >
                <i className={`${fa.fa} ${fa['fa-database']}`} />Data
              </IndexLink>
            </li>
            {context === 'data' && modelLinkages}
            <li>
              <IndexLink
                to={stringify(uris.pages.configs, { lang, app })}
                className={`${styles.header} ${context === 'configs' ? styles.active : ''}`}
                onClick={this.handleClick}
              >
                <i className={`${fa.fa} ${fa['fa-cogs']}`} />Settings
              </IndexLink>
            </li>
            <li>
              <a
                className={styles.header}
                href={stringify(uris.pages.docs, { app })}
              >
                <i className={`${fa.fa} ${fa['fa-book']}`} />API Doc
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  app: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
  modelName: PropTypes.string,
  models: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  editing: PropTypes.bool,
  lang: PropTypes.string.isRequired,
};
