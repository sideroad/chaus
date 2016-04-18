import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as appsActions from 'redux/modules/apps';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';


@asyncConnect([{
  promise: ({store: {dispatch}}) => {
    const promises = [];
    promises.push(dispatch(appsActions.load()));
    return Promise.all(promises);
  }
}])
@connect(
  state=>({
    apps: state.apps.data,
    query: state.apps.query,
    candidate: state.apps.candidate
  }),
  {
    ...appsActions,
    push: routeActions.push
  })
export default class Card extends Component {
  static propTypes = {
    apps: PropTypes.array,
    query: PropTypes.string,
    candidate: PropTypes.string,
    push: PropTypes.func.isRequired
  };

  render() {
    const {
      apps,
      query,
      candidate
    } = this.props;

    const styles = {
      base: require('../css/customize.less'),
      app: require('../css/app.less')
    };

    return (
      <div className={styles.app.items}>
        {apps && apps.map(app => (
          <div key={app.id} className={styles.app.item} >
            <a className={styles.app.card + ' ' + (candidate === app.id ? styles.app.selected : '')}
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
        {!query &&
         !apps.length ? <div className={styles.app.lead}>
                          Type to Find or Create API
                        </div> : ''}
      </div>
    );
  }
}
