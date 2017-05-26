import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import fa from '../css/koiki-ui/fa/less/font-awesome.less';

const styles = require('../css/record-form.less');

const RecordForm = (props) => {
  const editable = props.id !== undefined;
  // TODO: Realtime validation

  return (
    <tr>
      <td>
        <div className={styles.text}>id</div>
        <div className={styles.value} >
          <span>{props.id}</span>
        </div>
      </td>
      {
        props.targets.map((attribute, index) => {
          const isInvalid = props.err &&
                            props.err[attribute.name];
          return (
            <td key={`${props.model} ${attribute.name} + ${index}`}>
              <div className={styles.text}>{attribute.name}</div>
              <div className={styles.value} >
                {
                  attribute.uniq === true &&
                  attribute.type !== 'boolean' &&
                  editable ?
                    <span>{props.item[attribute.name]}</span>
                  :
                    <Field
                      name={attribute.name}
                      className={`
                        ${styles.input}
                        ${isInvalid ? styles.error : ''}
                        ${attribute.type === 'boolean' ? styles.checkbox : ''}
                      `}
                      type={
                        attribute.type === 'number' ? 'number' :
                        attribute.type === 'boolean' ? 'checkbox' :
                        attribute.type === 'date' ? 'date' : 'text'
                      }
                      value={props.item[attribute.name]}
                      component="input"
                      onKeyPress={
                        (event) => {
                          switch (event.key) {
                            case 'Enter':
                              props.handleSubmit(
                                (values) => {
                                  if (editable) {
                                    props.onUpdate(props.id, values);
                                  } else {
                                    props.onCreate(values);
                                  }
                                }
                              )(event);
                              break;
                            default:
                              return;
                          }
                        }
                      }
                      disabled={attribute.uniq && editable ? 'disabled' : ''}
                    />
                }
                {
                  attribute.type === 'boolean' ? <label htmlFor={index} /> : ''
                }
              </div>
            </td>
          );
        })
      }
      <td
        className={styles.control}
      >
        <button
          className={styles.save}
          onClick={
            props.handleSubmit((values) => {
              if (editable) {
                props.onUpdate(props.id, values);
              } else {
                props.onCreate(values);
              }
            })
          }
        >
          <i className={`${fa.fa} ${fa['fa-save']}`} />
        </button>
        <button
          className={styles.trash}
          onClick={(event) => {
            event.preventDefault(); // prevent form submission
            props.onDelete(props.id);
          }}
        >
          <i className={`${fa.fa} ${fa['fa-close']}`} />
        </button>
      </td>
    </tr>
  );
};

RecordForm.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  model: PropTypes.string.isRequired,
  id: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  targets: PropTypes.array.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  err: PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  onUpdate: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  item: PropTypes.object.isRequired
};

export default reduxForm({
})(RecordForm);
