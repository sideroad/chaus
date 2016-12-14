import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';

function RecordForm(props) {
  const {
    id,
    model,
    targets,
    handleSubmit,
    item,
    err,
  } = props;
  const editable = id !== undefined ? true : false;
  const styles = require('../css/customize.less');
  // TODO: Realtime validation

  return (
    <tr>
      <td className="uk-text-left">
        <div className="uk-grid" >
          <div className={'uk-visible-small ' + styles['cm-record-text']}>id</div>
          <div className={'uk-width-7-10 ' + styles['cm-record-value']} >
            <span>{id}</span>
          </div>
        </div>
      </td>
      {
        targets.map((attribute, index) => {
          const isInvalid = err &&
                            err[attribute.name] ? true : false;
          return (
            <td className="uk-text-left" key={`${model} ${attribute.name} + ${index}`}>
              <div className="uk-grid" >
                <div className={'uk-visible-small ' + styles['cm-record-text']}>{attribute.name}</div>
                <div className={'uk-width-7-10 ' + styles['cm-record-value']} >
                  {
                    attribute.uniq === true &&
                    attribute.type !== 'boolean' &&
                    editable ?
                      <span>{item[attribute.name]}</span>
                    :
                      <Field
                        name={attribute.name}
                        className={styles.input + ' ' +
                          styles['cm-record-input'] + ' ' +
                          (isInvalid ? ' uk-form-danger' : '') +
                          (attribute.type === 'boolean' ? ' ' + styles['cm-checkbox'] : '')
                        }
                        type={
                          attribute.type === 'number' ? 'number' :
                          attribute.type === 'boolean' ? 'checkbox' :
                          attribute.type === 'date' ? 'date' : 'text'
                        }
                        value={item[attribute.name]}
                        component="input"
                        onKeyPress={
                          (event)=>{
                            switch (event.key) {
                              case 'Enter':
                                handleSubmit(
                                  values =>
                                    editable ? props.onUpdate(id, values) : props.onCreate(values)
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
              </div>
            </td>
          );
        })
      }
      <td className="uk-text-center">
        <div className="uk-grid" >
          <div className="uk-width-1-2" >
            <a onClick={
                handleSubmit( values => {
                  if ( editable ) {
                    props.onUpdate(id, values);
                  } else {
                    props.onCreate(values);
                  }
                })
              }>
              <i className={'uk-icon-save uk-icon-small ' + styles['cm-icon']} />
            </a>
          </div>
          <div className="uk-width-1-2" >
            <a onClick={event => {
              event.preventDefault(); // prevent form submission
              props.onDelete(id);
            }}>
              <i className={'uk-icon-close uk-icon-small ' + styles['cm-icon']} />
            </a>
          </div>
        </div>
      </td>
    </tr>
  );
}

RecordForm.propTypes = {
  app: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  id: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  targets: PropTypes.array.isRequired,
  err: PropTypes.object,
  fields: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default reduxForm({
})(RecordForm);
