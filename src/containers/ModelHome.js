import React, {Component} from 'react';

export default class ModelHome extends Component {
  render() {
    const styles = require('../css/customize.less');
    const contents = {
      title: 'Models',
      lead: 'Build RESTful API within 5 min'
    };

    // TODO: CORS settings cross origin policy
    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles['cm-title']}>{contents.title}</h1>
          <hr className="uk-article-divider" />
          <div className={styles['cm-symbolic']} >
          </div>
        </article>
      </div>
    );
  }
}
