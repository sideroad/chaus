import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { v4 } from 'uuid';

class ConfigForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    callFromServer: PropTypes.bool.isRequired
  };

  render() {
    const {
      handleSubmit,
      callFromServer
    } = this.props;
    const styles = {
      base: require('../css/customize.less'),
      config: require('../css/config.less')
    };
    return (
      <form className={styles.config.form + ' uk-form'} onSubmit={
        handleSubmit(({ caller, client, secret, description, origins }) =>
          this.props.onSave({
            caller,
            client: client || v4(),
            secret: caller === 'server' ? secret || v4() : '',
            description,
            origins
          }))
      }>
        <article className="uk-article">
          <h1 className={'uk-article-title ' + styles.base['cm-title']}>App settings</h1>
          <hr className="uk-article-divider" />
          <h2 className={styles.base['cm-title']}>Call from</h2>
          <label><Field name="caller" component="input" type="radio" value="client"/> Client</label>
          <label><Field name="caller" component="input" type="radio" value="server"/> Server</label>
          {
            callFromServer ?
              <div>
                <h3 className={styles.base['cm-title']}>Client ID</h3>
                <Field
                  name="client"
                  component="input"
                  type="text"
                  className={styles.base.input + ' uk-width-10'}
                  readOnly
                />
                <h3 className={styles.base['cm-title']}>Secret ID</h3>
                <Field
                  name="secret"
                  component={
                    (field) =>
                      <div>
                        <input
                          {...field.input}
                          type="text"
                          className={styles.base.input + ' uk-width-8-10'}
                          readOnly
                        />
                        <button
                          className="uk-button uk-button-primary uk-width-2-10"
                          onClick={event => {
                            event.preventDefault();
                            field.input.onChange(v4());
                          }}>
                          <i className="uk-icon-refresh uk-icon-small"></i>
                        </button>
                      </div>
                  }
                />
            </div> : ''
          }
          <h1 className={'uk-article-title ' + styles.base['cm-title']}>Description</h1>
          <hr className="uk-article-divider" />
          <Field
            name="description"
            component="textarea"
            className={styles.config.description + ' ' + styles.base.input}
          />

          <h1 className={'uk-article-title ' + styles.base['cm-title']}>CORS URL</h1>
          <hr className="uk-article-divider" />
          <FieldArray
            name="origins"
            component={
              ({ fields }) =>
                <table className={styles.base['cm-table'] + ' uk-table uk-table-striped uk-table-condensed'}>
                  <tbody>
                    {
                      fields.map((origin, index)=> console.log(origin) ||
                        <tr key={index}>
                          <td className="uk-text-center" >
                            <div className="uk-grid" >
                              <div className="uk-width-8-10" >
                                <Field
                                  name={`${origin}.url`}
                                  className={styles.config.url + ' ' + styles.base.input}
                                  placeholder="Client domain"
                                  component="input"
                                  type="text"
                                />
                              </div>
                              <div className={'uk-width-2-10 ' + styles.config.remove}>
                                <a onClick={event => {
                                  event.preventDefault(); // prevent form submission
                                  fields.remove(index);
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
                        <button
                          className={'uk-button ' + styles.base['cm-row-plus']}
                          onClick={
                            event => {
                              event.preventDefault();
                              fields.push({
                                url: ''
                              });
                            }
                          }
                        >
                          <i className="uk-icon-plus uk-icon-small" />
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
            }
          />
          <button
            className={'uk-button uk-button-primary uk-button-large ' + styles.base['cm-button'] + ' ' + styles.config.save}
            type="submit"
          >
            <i className={'uk-icon-floppy-o ' + styles.base['cm-icon']}/>
            Save
          </button>

          <button className={'uk-button uk-button-danger uk-button-large ' + styles.base['cm-button'] + ' ' + styles.config.delete} type="button"
           onClick={
             () => {
               this.props.onDelete();
             }
           }>
            <i className={'uk-icon-trash ' + styles.base['cm-icon']} />
            Delete API
          </button>
        </article>

      </form>
    );
  }
}

export default reduxForm({
  form: 'apps'
})(ConfigForm);
