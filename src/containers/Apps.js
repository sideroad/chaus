import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import {AppCard, AppForm} from 'components';
import config from '../config';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';

@connect(
  (state)=>({
    query: state.apps.query
  }),
  {})
export default class Apps extends Component {
  static propTypes = {
    query: PropTypes.string,
    params: PropTypes.object.isRequired
  };

  render() {
    const values = {
      app: this.props.query
    };
    const styles = {
      base: require('../css/customize.less'),
      app: require('../css/app.less')
    };
    const lang = this.props.params.lang;

    return (
      <div className={styles.base['cm-container']} >
        <Helmet {...config.app.head} title="Find, Create your App" />
        <Main children={
          <div className={styles.app.app}>
            <AppForm initialValues={
              values
            } lang={lang}/>
            <AppCard lang={lang}/>
          </div>
        } lang={lang}/>
      </div>
    );
  }
}
