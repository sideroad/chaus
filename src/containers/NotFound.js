import React, {Component} from 'react';

export default class NotFound extends Component {
  render() {
    const styles = require('../css/customize.less');
    return (
      <div className={'uk-width-medium-8-10 ' + styles.contents + ' ' + styles['cm-tv']} >
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles['cm-title']}>Doh! 404!</h1>
          <hr className="uk-article-divider" />
          <p>These are <em>not</em> the droids you are looking for!</p>
        </article>
      </div>
    );
  }
}
