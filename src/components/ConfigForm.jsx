import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { v4 } from 'uuid';
import { Button } from 'koiki-ui';
import fa from '../css/koiki-ui/fa/less/font-awesome.less';
import styles from '../css/config-form.less';

const ConfigForm = props =>
  <form
    className={styles.form}
    onSubmit={props.handleSubmit}
  >
    <div className={styles.header}>
      <h1 className={styles.lead} >Authentication</h1>
    </div>
    <div className={styles.radios}>
      <Field name="caller" component="input" type="radio" value="client" id="caller-client" />
      <label className={styles.radio} htmlFor="caller-client" >
         Unlimited
      </label>
      <Field name="caller" component="input" type="radio" value="server" id="caller-server" />
      <label className={styles.radio} htmlFor="caller-server" >
        Limited
      </label>
    </div>
    {
      props.callFromServer ?
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>Client ID</td>
              <td>
                <Field
                  name="client"
                  component="input"
                  type="text"
                  className={`${styles.input} ${styles.client}`}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>Secret ID</td>
              <td>
                <Field
                  name="secret"
                  component={
                    field =>
                      <div className={styles.secrets} >
                        <input
                          {...field.input}
                          type="text"
                          className={`${styles.input} ${styles.secret}`}
                          readOnly
                        />
                        <button
                          className={styles.refresh}
                          onClick={(event) => {
                            event.preventDefault();
                            field.input.onChange(v4());
                          }}
                        >
                          <i className={`${fa.fa} ${fa['fa-refresh']}`} />
                        </button>
                      </div>
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      : ''
    }
    <div className={styles.spacer} />
    <div className={styles.header}>
      <h1 className={styles.lead} >Description</h1>
    </div>
    <Field
      name="description"
      component="textarea"
      className={styles.description}
    />
    <div className={styles.spacer} />
    <div className={styles.header}>
      <h1 className={styles.lead} >CORS URL</h1>
    </div>
    <FieldArray
      name="origins"
      component={
        ({ fields }) =>
          <table className={`${styles.table} ${styles.origins}`}>
            <tbody>
              {
                fields.map((origin, index) =>
                  <tr key={index}>
                    <td>
                      <div className={styles.origin}>
                        <Field
                          name={`${origin}.url`}
                          className={`${styles.input} ${styles.url} ${props.err && props.index === index ? styles.err : ''}`}
                          placeholder="Client domain"
                          component="input"
                          type="text"
                        />
                        <button
                          className={styles.remove}
                          onClick={(event) => {
                            event.preventDefault(); // prevent form submission
                            fields.remove(index);
                          }}
                        >
                          <i className={`${fa.fa} ${fa['fa-close']}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
              )
            }
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <button
                    className={styles.plus}
                    onClick={
                      (event) => {
                        event.preventDefault();
                        fields.push({
                          url: ''
                        });
                      }
                    }
                  >
                    <i className={`${fa.fa} ${fa['fa-plus']}`} />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
      }
    />
    <div className={styles.spacer} />
    <div className={styles.control}>
      <div className={styles.save}>
        <Button
          icon="fa-floppy-o"
          text="Save"
          color="primary"
          styles={{
            fa,
            button: require('../css/koiki-ui/button.less'),
          }}
        />
      </div>
      <div className={styles.delete}>
        <Button
          icon="fa-trash"
          text="Delete API"
          color="secondary"
          styles={{
            fa,
            button: require('../css/koiki-ui/button.less'),
          }}
          onClick={
            () => {
              props.onDelete();
            }
          }
        />
      </div>
    </div>
  </form>;

ConfigForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  callFromServer: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  err: PropTypes.object,
};

export default reduxForm({
  form: 'apps'
})(ConfigForm);
