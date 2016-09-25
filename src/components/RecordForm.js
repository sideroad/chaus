import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';

@reduxForm({
  form: 'record'
})
export default class RecordForm extends Component {
  static propTypes = {
    formKey: PropTypes.string.isRequired,
    app: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    id: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    targets: PropTypes.array.isRequired,
    err: PropTypes.object,
    fields: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired
  };

  render() {
    const {
      id,
      fields,
      targets,
      handleSubmit,
      err,
      formKey
    } = this.props;
    const editing = id !== undefined ? true : false;
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
              <td className="uk-text-left" key={index}>
                <div className="uk-grid" >
                  <div className={'uk-visible-small ' + styles['cm-record-text']}>{attribute.name}</div>
                  <div className={'uk-width-7-10 ' + styles['cm-record-value']} >
                    {
                      attribute.uniq === true &&
                      attribute.type !== 'boolean' &&
                      editing ?
                        <span>{fields[attribute.name].value}</span>
                      :
                        <input
                          id={formKey + index}
                          className={styles['cm-input'] + ' ' +
                            styles['cm-record-input'] + ' ' +
                            (isInvalid ? ' uk-form-danger' : '') +
                            (attribute.type === 'boolean' ? ' ' + styles['cm-checkbox'] : '')
                          }
                          type={
                            attribute.type === 'number' ? 'number' :
                            attribute.type === 'boolean' ? 'checkbox' :
                            attribute.type === 'date' ? 'date' : 'text'
                          }
                          {...fields[attribute.name]}
                          onKeyPress={
                            (event)=>{
                              switch (event.key) {
                                case 'Enter':
                                  handleSubmit(
                                    values =>
                                      editing ? this.props.onUpdate(id, values) : this.props.onCreate(values)
                                  )(event);
                                  break;
                                default:
                                  return;
                              }
                            }
                          }
                          disabled={attribute.uniq &&
                                    editing ? 'disabled' : ''}
                        />
                    }
                    {
                      attribute.type === 'boolean' ? <label htmlFor={formKey + index} /> : ''
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
                    if ( editing ) {
                      this.props.onUpdate(id, values);
                    } else {
                      this.props.onCreate(values);
                    }
                  })
                }>
                <i className={'uk-icon-save uk-icon-small ' + styles['cm-icon']} />
              </a>
            </div>
            <div className="uk-width-1-2" >
              <a onClick={event => {
                event.preventDefault(); // prevent form submission
                this.props.onDelete(id);
              }}>
                <i className={'uk-icon-close uk-icon-small ' + styles['cm-icon']} />
              </a>
            </div>
          </div>
        </td>
      </tr>
    );
  }
}
