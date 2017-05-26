import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, FieldArray } from 'redux-form';
import __ from 'lodash';
import { Button } from 'koiki-ui';

import RelationSelectBox from '../components/RelationSelectBox';
import fa from '../css/koiki-ui/fa/less/font-awesome.less';
import styles from '../css/attribute-form.less';

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

    const handleDragStart = (fields, event, dragFrom) => {
      event.preventDefault();
      this.setState({
        dragFrom,
        dragTo: null,
        dragging: true
      });
    };
    const handleDrag = (fields, event, dragTo) => {
      event.preventDefault();
      if (
        this.state.dragging &&
        this.state.dragFrom !== dragTo
      ) {
        fields.swap(this.state.dragFrom, dragTo);
        this.setState({
          dragFrom: dragTo,
          dragTo: this.state.dragFrom
        });
      }
    };
    const handleDrop = (fields, event) => {
      event.preventDefault();
      this.setState({
        dragFrom: null,
        dragTo: null,
        dragging: false
      });
    };

    // TODO: [BUG]attributes does not initilized with initilizedValue on Server-side
    //       when Array has passed.
    //       Therefore below Error will be shown and Initialize again in client-side
    //       Server-side React render was discarded. Make sure that your initial render
    //       does not contain any client-side code
    //       redux-form might has a bug

    // TODO: [Bug]When data is null, previous value will be used.
    return (
      <form onSubmit={handleSubmit}>
        <Field name="model" component="input" type="hidden" />
        <FieldArray
          name="attributes"
          component={
            ({ fields }) =>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th />
                    <th>Name</th>
                    <th>Unique</th>
                    <th>Required</th>
                    <th>Type</th>
                    <th>Pattern</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {
                    fields.map((attribute, index) =>
                      <tr
                        key={`${model}${index}${attribute}`}
                        className={this.state.dragFrom === index ? styles.drag :
                                   this.state.dragTo === index ? styles.drop : ''}
                      >
                        <td
                          onMouseDown={event => handleDragStart(fields, event, index)}
                          onMouseOver={event => handleDrag(fields, event, index)}
                          onMouseUp={event => handleDrop(fields, event, index)}
                          className={`${styles.handle} ${this.state.dragging ? styles.dragging : ''}`}
                        >
                          <a className={styles.reorder} >
                            <div className={styles.uparrow} />
                            <div className={`${styles.stick} ${styles.first}`} />
                            <div className={styles.stick} />
                            <div className={`${styles.stick} ${styles.last}`} />
                            <div className={styles.downarrow} />
                          </a>
                        </td>
                        <td>
                          <div className={styles.text}>Name</div>
                          <div className={styles.value} >
                            <Field
                              type="text"
                              component="input"
                              name={`${attribute}.name`}
                              placeholder="Attribute name"
                              className={`${styles.input}
                                          ${err && this.props.index === index ? styles.error : ''}`}
                            />
                          </div>
                        </td>
                        <td>
                          <div className={styles.text}>Unique</div>
                          <div className={styles.value} >
                            <Field
                              id={`${index}-uniq-name`}
                              className={styles.checkbox}
                              type="checkbox"
                              component="input"
                              name={`${attribute}.uniq`}
                            />
                            <label htmlFor={`${index}-uniq-name`} />
                          </div>
                        </td>
                        <td>
                          <div className={styles.text}>Required</div>
                          <div className={styles.value} >
                            <Field
                              id={`${index}-required-name`}
                              className={styles.checkbox}
                              type="checkbox"
                              component="input"
                              name={`${attribute}.required`}
                            />
                            <label htmlFor={`${index}-required-name`} />
                          </div>
                        </td>
                        <td>
                          <div className={styles.text}>Type</div>
                          <div className={styles.value} >
                            <p>
                              <Field
                                className={styles.selectbox}
                                component="select"
                                name={`${attribute}.type`}
                              >
                                {
                                  types.map(option =>
                                    <option value={option} key={option} >{option}</option>
                                  )
                                }
                              </Field>
                            </p>
                            <p>
                              {
                                relationTypes.includes(fields.get(index).type) &&
                                <Field
                                  className={styles.selectbox}
                                  component="select"
                                  name={`${attribute}.relation`}
                                >
                                  {
                                    relations.map(relation =>
                                      <option value={relation.id} key={relation.id} >
                                        {relation.name}
                                      </option>
                                    )
                                  }
                                </Field>
                              }
                            </p>
                            {
                              fields.get(index).type === 'parent' &&
                              fields.get(index).relation &&
                              <RelationSelectBox
                                attribute={attribute}
                                relation={fields.get(index).relationAttribute}
                                model={(__.find(relations, {
                                  id: fields.get(index).relation
                                }) || { name: '' }).name}
                              />
                            }
                          </div>
                        </td>
                        <td>
                          <div className={styles.text}>Pattern</div>
                          <div className={styles.value} >
                            <span>/</span>
                            <Field
                              type="text"
                              className={`${styles.input} ${styles.regexp}`}
                              placeholder="Regular expression"
                              component="input"
                              name={`${attribute}.pattern`}
                            />
                            <span>/</span>
                            <Field
                              className={styles.textarea}
                              placeholder="Invalid message"
                              component="textarea"
                              name={`${attribute}.invalid`}
                            />
                          </div>
                        </td>
                        <td
                          className={styles.control}
                        >
                          <button
                            className={styles.trash}
                            onClick={(evt) => {
                              evt.preventDefault();
                              console.log(evt.target);
                              fields.remove(index);
                            }}
                          >
                            <i className={`${fa.fa} ${fa['fa-close']}`} />
                          </button>
                        </td>
                      </tr>
                    )
                  || ' '}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="8">
                      <button
                        className={styles.plus}
                        onClick={(evt) => {
                          evt.preventDefault();
                          fields.push({
                            type: 'string'
                          });
                        }}
                      >
                        <i className={`${fa.fa} ${fa['fa-plus']}`} />
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
          }
        />
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
      </form>
    );
  }
}

AttributeForm.propTypes = {
  model: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  relations: PropTypes.array.isRequired,
  err: PropTypes.object,
  index: PropTypes.number
};

export default reduxForm({
  form: 'attribute',
  enableReinitialize: true
})(AttributeForm);
