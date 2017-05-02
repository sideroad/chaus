import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form';
import RelationSelectBox from '../components/RelationSelectBox';
import __ from 'lodash';

class AttributeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragFrom: null,
      dragTo: null
    };
  }

  render() {
    const {
      model,
      handleSubmit,
      relations,
      err
    } = this.props;

    const types = [
      'string',
      'number',
      'date',
      'boolean',
      'parent',
      'children',
      'instance'
    ];
    const relationTypes = [
      'parent',
      'children',
      'instance'
    ];

    const handleDrag = (fields, event, dragFrom) => {
      const img = document.createElement('img');
      img.src = '/images/null.png';
      event.dataTransfer.setDragImage( img, 0, 0);
      this.setState({
        dragFrom,
        dragTo: null
      });
    };
    const handleDragOver = (fields, event) => {
      event.preventDefault();
      return false;
    };
    const handleDragEnter = (fields, event, dragTo) => {
      if ( this.state.dragFrom !== null &&
           dragTo !== null &&
           this.state.dragFrom !== dragTo ) {
        fields.swap(this.state.dragFrom, dragTo);
        this.setState({
          dragFrom: dragTo,
          dragTo: this.state.dragFrom
        });
      }
      event.stopPropagation(); // Stops some browsers dragFrom redirecting.
    };
    const handleDrop = (fields, event) => {
      event.stopPropagation(); // Stops some browsers from redirecting.
      this.setState({
        dragFrom: null,
        dragTo: null
      });
      return false;
    };
    const styles = require('../css/customize.less');

    // TODO: [BUG]attributes does not initilized with initilizedValue on Server-side when Array has passed.
    //       Therefore below Error will be shown and Initialize again in client-side
    //       Server-side React render was discarded. Make sure that your initial render does not contain any client-side code
    //       redux-form might has a bug

    // TODO: [Bug]When data is null, previous value will be used.
    return (
      <form className="uk-form">
        <Field name="model" component="input" type="hidden" />
        <FieldArray
          name="attributes"
          component={
            ({ fields }) =>
              <table className={styles['cm-table'] + ' uk-table uk-table-striped uk-table-condensed'}>
                <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Unique</th>
                      <th>Required</th>
                      <th>Type</th>
                      <th>Relation</th>
                      <th>Pattern</th>
                      <th></th>
                    </tr>
                </thead>
                <tbody>
                  {
                    fields.map((attribute, index) =>
                    <tr
                      key={`${model}${index}${attribute}`}
                      className={this.state.dragFrom === index ? styles['cm-drag'] :
                                 this.state.dragTo === index ? styles['cm-drop'] : ''} >
                      <td
                        draggable="true"
                        onDragStart={(event)=>{handleDrag(fields, event, index);}}
                        onDragOver={(event)=>{handleDragOver(fields, event, index);}}
                        onDragEnter={(event)=>{handleDragEnter(fields, event, index);}}
                        onDrop={(event)=>{handleDrop(fields, event, index);}}
                        dropZone="move"
                        className={styles['cm-handle']}>
                        <a className={styles['cm-icon-reorder']} >
                          <div className={styles['cm-up-arrow']} />
                          <div className={styles['cm-stick'] + ' ' + styles['cm-stick-first']} />
                          <div className={styles['cm-stick']} />
                          <div className={styles['cm-stick'] + ' ' + styles['cm-stick-last']} />
                          <div className={styles['cm-down-arrow']} />
                        </a>
                      </td>
                      <td>
                        <div className="uk-grid" >
                          <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Name</div>
                          <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                            <Field
                              type="text"
                              component="input"
                              name={`${attribute}.name`}
                              placeholder="Attribute name"
                              className={styles.input + ' ' +
                                         (err && this.props.index === index ? 'uk-form-danger' : '')}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="uk-text-center">
                        <div className="uk-grid" >
                          <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Unique</div>
                          <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                            <Field
                              id={index + 'uniq-name'}
                              className={styles['cm-checkbox']}
                              type="checkbox"
                              component="input"
                              name={`${attribute}.uniq`}
                            />
                            <label htmlFor={index + 'uniq-name'}></label>
                          </div>
                        </div>
                      </td>
                      <td className="uk-text-center">
                        <div className="uk-grid" >
                          <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Required</div>
                          <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                            <Field
                              id={index + 'required-name'}
                              className={styles['cm-checkbox']}
                              type="checkbox"
                              component="input"
                              name={`${attribute}.required`}
                            />
                            <label htmlFor={index + 'required-name'}></label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="uk-grid" >
                          <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Type</div>
                          <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                            <Field
                              className={styles['cm-selectbox']}
                              component="select"
                              name={`${attribute}.type`}
                            >
                              {types.map(option => <option value={option} key={option} >{option}</option>)}
                            </Field>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="uk-grid" >
                          <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Releation</div>
                          <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                            {
                              relationTypes.includes(fields.get(index).type) &&
                              <Field
                                className={styles['cm-selectbox']}
                                name="relation"
                                component="select"
                                name={`${attribute}.relation`}
                              >
                                <option >Select {fields.get(index).type} model</option>
                                {
                                  relations.map(relation =>
                                    <option value={relation.id} key={relation.id} >
                                      {relation.name}
                                    </option>
                                  )
                                }
                              </Field>
                            }
                            {
                              fields.get(index).type === 'parent' &&
                              fields.get(index).relation &&
                              <RelationSelectBox
                                attribute={attribute}
                                relation={fields.get(index).relationAttribute}
                                model={(__.find(relations, {id: fields.get(index).relation}) || {name: ''}).name}
                              />
                            }
                          </div>
                        </div>
                      </td>
                      <td className="uk-text-center">
                        <div className="uk-grid" >
                          <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Pattern</div>
                          <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                            <span className="uk-width-1-10" >/</span>
                            <Field
                              type="text"
                              className={styles.input + ' uk-width-6-10'}
                              placeholder="Regular expression"
                              component="input"
                              name={`${attribute}.pattern`}
                            />
                            <span className="uk-width-1-10" >/</span>
                            <input
                              id={index + 'invalid-message-icon'}
                              type="checkbox"
                              className={styles['cm-text']}
                            />
                            <label htmlFor={index + 'invalid-message-icon'} className={'uk-width-2-10 ' + styles['cm-icon'] + ' ' + styles['cm-icon-pattern']} >
                            <i className="uk-icon-file-text-o uk-icon-small" />
                            </label>
                            <p className={styles['cm-text-area']} >
                            <Field
                              className={styles.input + ' uk-width-1-1'}
                              placeholder="Invalid message"
                              component="textarea"
                              name={`${attribute}.invalid`}
                            />
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="uk-text-center">
                        <a onClick={event => {
                          event.preventDefault(); // prevent form submission
                          fields.remove(index);    // pushes empty child field onto the end of the array
                        }}>
                          <i className={'uk-icon-close uk-icon-small ' + styles['cm-icon']} />
                        </a>
                      </td>
                    </tr>
                    )
                  || ' '}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="8" className={styles['cm-row-plus']} >
                      <button
                        className={'uk-button ' + styles['cm-row-plus']}
                        onClick={event => {
                          event.preventDefault(); // prevent form submission
                          fields.push({
                            type: 'string'
                          });    // pushes empty child field onto the end of the array
                        }}>
                          <i className="uk-icon-plus uk-icon-small" />
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
          }
        />
        <button className={'uk-button uk-button-primary uk-button-large ' + styles['cm-button']}
          onClick={handleSubmit(values => {
            this.props.onSave(values);
          })}
        >
          <i className={'uk-icon-floppy-o ' + styles['cm-icon']}/>
          Save
        </button>
      </form>
    );
  }
}

AttributeForm.propTypes = {
  app: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  params: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  relations: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  err: PropTypes.object,
  index: PropTypes.number
};

export default reduxForm({
  form: 'attribute',
  enableReinitialize: true
})(AttributeForm);
