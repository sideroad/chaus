import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import * as recordActions from 'redux/modules/records';
import * as pageActions from 'redux/modules/page';

@connect(
  ()=>{
    return {};
  },
  {
    ...recordActions,
    loadPage: pageActions.load,
    restartPage: pageActions.restart
  })
@reduxForm({
  form: 'record'
})
export default class RecordForm extends Component {
  static propTypes = {
    model: PropTypes.string.isRequired,
    id: PropTypes.string,
    targets: PropTypes.array.isRequired,
    recordError: PropTypes.object,
    fields: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    loadPage: PropTypes.func.isRequired,
    restartPage: PropTypes.func.isRequired
  };

  render() {
    const {
      model,
      id,
      fields,
      targets,
      recordError,
      save,
      remove,
      values,
      loadPage,
      restartPage
    } = this.props;

    const edit = id !== undefined ? true : false;
    const styles = require('../css/customize.less');

    // TODO: Realtime validation

    // TODO: When error has occurred, display error
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
            const isInvalid = recordError &&
                              recordError.err[attribute.name] ? true : false;
            console.log(values);
            return (
              <td className="uk-text-left" key={index}>
                <div className="uk-grid" >
                  <div className={'uk-visible-small ' + styles['cm-record-text']}>{attribute.name}</div>
                  <div className={'uk-width-7-10 ' + styles['cm-record-value']} >
                    {
                      attribute.uniq === true &&
                      edit ?
                        <span>{fields[attribute.name].value}</span>
                      :
                        <input className={styles['cm-record-input'] + ' ' + (isInvalid ? 'uk-form-danger' : '')} type={
                                 attribute.type === 'number' ? 'number' :
                                 attribute.type === 'date' ? 'date' : 'text'
                               }
                               {...fields[attribute.name]} />
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
              <a onClick={event =>{
                event.preventDefault(); // prevent form submission
                const postValues = {};
                targets.map((attribute)=>{
                  if ( !attribute.uniq || !edit ) {
                    postValues[attribute.name] = values[attribute.name];
                  }
                });

                loadPage();
                return save(model, id, postValues)
                         .then(() => {
                           restartPage();
                         })
                         .catch(() => {
                           restartPage();
                         });
              }}>
                <i className={'uk-icon-save uk-icon-small ' + styles['cm-icon']} />
              </a>
            </div>
            <div className="uk-width-1-2" >
              <a onClick={event => {
                event.preventDefault(); // prevent form submission


                loadPage();
                return remove(model, id)
                         .then(() => {
                           restartPage();
                         })
                         .catch(() => {
                           restartPage();
                         });
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
