import React, {Component} from 'react';

export default class DataHome extends Component {
  render() {
    const styles = require('../css/customize.less');
    const contents = {
      title: 'chaus',
      lead: 'Manipulate API data'
    };
    return (
      <div className={'uk-width-medium-8-10 ' + styles['cm-contents']} >
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles['cm-title']}>{contents.title}</h1>
          <p className={styles['cm-lead'] + 'uk-article-lead'}>{contents.lead}</p>
          <hr className="uk-article-divider" />
          <div className={styles['cm-symbolic']} >
          </div>
        </article>
      </div>
    );
  }
}
