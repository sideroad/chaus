import React, {Component} from 'react';

export default class DataHome extends Component {
  render() {
    const styles = require('../css/customize.less');
    const contents = {
      title: 'Data',
      lead: 'Manipulate API data'
    };
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
