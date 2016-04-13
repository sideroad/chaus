import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import {Card} from 'components';
import {connect} from 'react-redux';
import config from '../config';
import Helmet from 'react-helmet';
import {reduxForm} from 'redux-form';
import * as appsActions from 'redux/modules/apps';
import * as pageActions from 'redux/modules/page';
import { routeActions } from 'react-router-redux';

@connect(
  state=>state,
  {
    ...appsActions,
    loadApp: appsActions.load,
    loadPage: pageActions.load,
    push: routeActions.push,
    restartPage: pageActions.restart
  })
@reduxForm({
  form: 'apps',
  fields: [
    'app'
  ]
})
export default class Apps extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    loadPage: PropTypes.func.isRequired,
    loadApp: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    restartPage: PropTypes.func.isRequired
  };

  render() {
    const {
      fields,
      save,
      loadPage,
      loadApp,
      restartPage
    } = this.props;

    const styles = {
      base: require('../css/customize.less'),
      app: require('../css/app.less')
    };
    const submit = (app) => {
      if( !app ) {
        return;
      }
      loadPage();
      loadApp(app).then(res => {
        if ( res.length ) {
          restartPage();
          this.props.push('/apps/' + app + '/models');
        } else {
          save(app)
            .then(result => {
              if (result && typeof result.error === 'object') {
                return Promise.reject(result.error);
              }
              restartPage();
              this.props.push('/apps/' + app + '/models');
            });
        }
      });
    };
    const search = (app) => {
      loadApp(app ? '*' + app + '*' : '');
    };

    return (
      <div className={styles.base['cm-container']} >
        <Helmet {...config.app.head} title="Find, Create your App" />
        <Main children={
          <div className={styles.app.app}>
            <div className={styles.app.box}>
                <input
                  {...fields.app}
                  className={styles.app.input + ' ' + styles.base['cm-input']}
                  placeholder="find or create API"
                  onKeyDown={
                    (evt) => {
                      switch (evt.key) {
                        case 'Enter':
                          submit(evt.target.value);
                          break;
                        default:
                      }
                    }
                  }
                  onChange={
                    (evt) => {
                      search(evt.target.value);
                    }
                  }
                />
                <img
                  src={require('../images/glass.png')}
                  className={styles.app.glass}
                  onClick={
                    ()=>{
                      submit(fields.app.value);
                    }
                  }
                />
            </div>
            <Card />
          </div>
        } />
      </div>
    );
  }
}
