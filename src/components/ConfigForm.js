import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';

@reduxForm({
  form: 'apps',
  fields: [
    'description',
    'origins[].url'
  ]
})
export default class ConfigForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  render() {
    const {
      fields,
      handleSubmit,
    } = this.props;
    const styles = {
      base: require('../css/customize.less'),
      config: require('../css/config.less')
    };

    return (
      <form className={styles.config.form + ' uk-form'} onSubmit={
        handleSubmit(values => {
          this.props.onSave(values);
        })
      }>
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles.base['cm-title']}>Description</h1>
          <hr className="uk-article-divider" />
          <textarea
            {...fields.description}
            className={styles.config.description + ' ' + styles.base.input} />

          <h1 className={'uk-article-title ' + styles.base['cm-title']}>CORS URL</h1>
          <hr className="uk-article-divider" />
          <table className={styles.base['cm-table'] + ' uk-table uk-table-striped uk-table-condensed'}>
            <tbody>
            {
              fields.origins.map((origin, index)=>
                <tr key={index}>
                  <td className="uk-text-center" >
                    <div className="uk-grid" >
                      <div className="uk-width-8-10" >
                        <input className={styles.config.url + ' ' + styles.base.input} {...origin.url} placeholder="Client domain" />
                      </div>
                      <div className={'uk-width-2-10 ' + styles.config.remove}>
                        <a onClick={event => {
                          event.preventDefault(); // prevent form submission
                          fields.origins.removeField(index);
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
                    fields.origins.addField();
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
               this.props.onDelete();
             }
           }>
            <i className={'uk-icon-trash ' + styles.base['cm-icon']}/>Delete API
          </button>
        </article>

      </form>
    );
  }
}
