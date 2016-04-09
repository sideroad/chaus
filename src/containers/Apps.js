import React, {Component, PropTypes} from 'react';
import {Main} from 'containers';
import {connect} from 'react-redux';
import config from '../config';
import Helmet from 'react-helmet';
import {reduxForm} from 'redux-form';
import * as appsActions from 'redux/modules/apps';
import * as pageActions from 'redux/modules/page';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';


@asyncConnect([{
  promise: ({store: {getState, dispatch}}) => {
    const promises = [];
    if ( !appsActions.isLoaded(getState()) ) {
      promises.push(dispatch(appsActions.load()));
    }
    return Promise.all(promises);
  }
}])
@connect(
  state=>({
    apps: state.apps.data
  }),
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
    apps: PropTypes.array,
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
      apps,
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
                      console.log(evt.target.value);
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
                <img src={require('../images/glass.png')} className={styles.app.glass}/>
            </div>
            <div className={styles.app.items}>
              {apps && apps.map(app => (
                <div key={app.id} className={styles.app.item} >
                  <a className={styles.app.card + ' ' + (fields.app.value === app.id ? styles.app.selected : '')}
                     onClick={
                       () => {
                         this.props.push('/apps/' + app.id + '/models');
                       }
                     }>
                    <div className={styles.app.primary}>
                      <div className={styles.app.name} >{app.name}</div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        } />
      </div>
    );
  }
}
