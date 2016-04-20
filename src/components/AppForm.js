import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import * as appsActions from 'redux/modules/apps';
import * as pageActions from 'redux/modules/page';
import { routeActions } from 'react-router-redux';

@connect(
  (state)=>({
    candidate: state.apps.candidate
  }),
  {
    ...appsActions,
    loadApp: appsActions.load,
    next: appsActions.next,
    prev: appsActions.prev,
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
export default class AppForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    loadPage: PropTypes.func.isRequired,
    loadApp: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    restartPage: PropTypes.func.isRequired,
    candidate: PropTypes.string,
    next: PropTypes.func.isRequired,
    prev: PropTypes.func.isRequired
  };

  render() {
    const {
      values,
      fields,
      save,
      loadPage,
      loadApp,
      restartPage,
      candidate,
      next,
      prev
    } = this.props;
    const styles = {
      base: require('../css/customize.less'),
      app: require('../css/app.less')
    };
    const submit = (app) => {
      if ( !app ) {
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
      loadApp(app);
    };

    return (
      <div className={styles.app.box}>
        <div className={styles.app.candidate}>{candidate}</div>
        <input
          {...fields.app}
          className={styles.app.input + ' ' + styles.base['cm-input']}
          onKeyDown={
            (evt) => {
              switch (evt.key) {
                case 'Enter':
                  submit(evt.target.value);
                  break;
                case 'Tab':
                  if ( candidate ) {
                    loadApp(candidate);
                  }
                  fields.app.value = candidate;
                  values.app = candidate;
                  evt.preventDefault();
                  break;
                case 'ArrowUp':
                  prev();
                  evt.preventDefault();
                  break;
                case 'ArrowDown':
                  next();
                  evt.preventDefault();
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
    );
  }
}
