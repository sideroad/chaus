import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import * as configsActions from 'redux/modules/configs';
import * as appsActions from 'redux/modules/apps';
import * as pageActions from 'redux/modules/page';
import { routeActions } from 'react-router-redux';

@connect(
  ()=>({}),
  {
    ...configsActions,
    loadPage: pageActions.load,
    push: routeActions.push,
    restartPage: pageActions.restart,
    finishLoad: pageActions.finishLoad,
    closeSidebar: pageActions.closeSidebar,
    removeApp: appsActions.remove
  })
@reduxForm({
  form: 'apps',
  fields: [
    'description',
    'urls[]'
  ]
})
export default class ConfigForm extends Component {
  static propTypes = {
    app: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    loadPage: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    restartPage: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    finishLoad: PropTypes.func.isRequired,
    removeApp: PropTypes.func.isRequired,
    closeSidebar: PropTypes.func.isRequired
  };

  render() {
    const {
      app,
      lang,
      fields,
      save,
      values,
      loadPage,
      restartPage
    } = this.props;
    const styles = {
      base: require('../css/customize.less'),
      config: require('../css/config.less')
    };

    return (
      <form className={styles.config.form + ' uk-form'} onSubmit={
        event => {
          event.preventDefault();
          loadPage();
          console.log(values);
          save(app, values)
            .then(() => {
              restartPage();
            })
            .catch(() => {
              restartPage();
            });
        }
      }>
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles.base['cm-title']}>Description</h1>
          <hr className="uk-article-divider" />
          <textarea
            {...fields.description}
            className={styles.config.description + ' ' + styles.base['cm-input']} />

          <h1 className={'uk-article-title ' + styles.base['cm-title']}>CORS URL</h1>
          <hr className="uk-article-divider" />
          <table className={styles.base['cm-table'] + ' uk-table uk-table-striped uk-table-condensed'}>
            <tbody>
            {
              fields.urls.map((url, index)=>
                <tr key={index}>
                  <td className="uk-text-center" >
                    <div className="uk-grid" >
                      <div className="uk-width-9-10" >
                        <input className={styles.config.url + ' ' + styles.base['cm-input']} {...url} placeholder="Client domain" />
                      </div>
                      <div className={'uk-width-1-10 ' + styles.config.remove}>
                        <a onClick={event => {
                          event.preventDefault(); // prevent form submission
                          fields.urls.removeField(index);
                        }}>
                          <i className={'uk-icon-close uk-icon-small ' + styles.base['cm-icon']} />
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            }
            </tbody>
            <tfoot>
              <tr>
                <td className={styles.base['cm-row-plus']}>
                  <button className={'uk-button ' + styles.base['cm-row-plus']} onClick={event => {
                    event.preventDefault();
                    fields.urls.addField();
                  }}>
                    <i className="uk-icon-plus uk-icon-small"></i>
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>

          <button className={'uk-button uk-button-primary uk-button-large ' + styles.base['cm-button'] + ' ' + styles.config.save} type="submit" >
            <i className={'uk-icon-floppy-o ' + styles.base['cm-icon']}/>
            Save
          </button>

          <button className={'uk-button uk-button-danger uk-button-large ' + styles.base['cm-button'] + ' ' + styles.config.delete} type="button"
           onClick={
             () => {
               this.props.closeSidebar();
               this.props.loadPage();
               this.props.removeApp(app)
                 .then(()=> {
                   this.props.finishLoad();
                   this.props.push('/apps/' + lang);
                 });
             }
           }>
            <i className={'uk-icon-trash ' + styles.base['cm-icon']}/>Delete API
          </button>
        </article>

      </form>
    );
  }
}
