import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import * as attributeActions from 'redux/modules/attributes';
import * as pageActions from 'redux/modules/page';
import {RelationSelectBox} from 'components';

@connect(
  (state, props) => ({
    relations: state.models[props.app].data,
    from: state.attributes.from,
    to: state.attributes.to
  }),
  {
    ...attributeActions,
    loadPage: pageActions.load,
    restartPage: pageActions.restart
  })
@reduxForm({
  form: 'attribute',
  fields: [
    'model',
    'attributes[].name',
    'attributes[].uniq',
    'attributes[].required',
    'attributes[].type',
    'attributes[].relation',
    'attributes[].relationAttribute',
    'attributes[].pattern',
    'attributes[].invalid'
  ]
})
export default class AttributeForm extends Component {
  static propTypes = {
    app: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    params: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    relations: PropTypes.array.isRequired,
    values: PropTypes.object.isRequired,
    from: PropTypes.number,
    to: PropTypes.number,
    drag: PropTypes.func.isRequired,
    drop: PropTypes.func.isRequired,
    loadPage: PropTypes.func.isRequired,
    restartPage: PropTypes.func.isRequired,
    saveError: PropTypes.object
  };

  render() {
    const {
      fields: {attributes, model},
      handleSubmit,
      relations,
      app,
      save,
      values,
      from,
      to,
      drag,
      drop,
      loadPage,
      restartPage,
      saveError
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

    const handleDrag = (event, _from) => {
      const img = document.createElement('img');
      img.src = '/images/null.png';
      event.dataTransfer.setDragImage( img, 0, 0);
      drag(_from);
    };
    const handleDragOver = (event) => {
      event.preventDefault();
      return false;
    };
    const handleDragEnter = (event, _to) => {
      attributes.swapFields(from, _to);
      event.stopPropagation(); // Stops some browsers from redirecting.
    };
    const handleDragLeave = (event, _from) => {
      attributes.swapFields(_from, to);
    };
    const handleDrop = (event) => {
      event.stopPropagation(); // Stops some browsers from redirecting.
      drop(to);
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
              attributes && attributes.length &&
              attributes.map((attribute, index) =>
              <tr key={index} className={from === index ? styles['cm-drag'] :
                                         to === index ? styles['cm-drop'] : ''} >
                <td draggable="true"
                  onDragStart={(event)=>{handleDrag(event, index);}}
                  onDragOver={(event)=>{handleDragOver(event, index);}}
                  onDragEnter={(event)=>{handleDragEnter(event, index);}}
                  onDragLeave={(event)=>{handleDragLeave(event, index);}}
                  onDrop={(event)=>{handleDrop(event, index);}}
                  dropzone="move"
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
                      <input type="text"
                             name="name"
                             placeholder="Attribute name"
                             {...attribute.name}
                             className={styles['cm-input'] + ' ' +
                                        (saveError && saveError.index === index ? 'uk-form-danger' : '')}
                      />
                    </div>
                  </div>
                </td>
                <td className="uk-text-center">
                  <div className="uk-grid" >
                    <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Unique</div>
                    <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                      <input id={index + 'uniq-name'} className={styles['cm-checkbox']} type="checkbox" name="uniq" {...attribute.uniq} />
                      <label htmlFor={index + 'uniq-name'}></label>
                    </div>
                  </div>
                </td>
                <td className="uk-text-center">
                  <div className="uk-grid" >
                    <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Required</div>
                    <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                      <input id={index + 'required-name'} className={styles['cm-checkbox']} type="checkbox" name="required" {...attribute.required} />
                      <label htmlFor={index + 'required-name'}></label>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="uk-grid" >
                    <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Type</div>
                    <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                      <select className={styles['cm-selectbox']} {...attribute.type} value={attribute.type.value} >
                      {types.map(option => <option value={option} key={option} >{option}</option>)}
                      </select>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="uk-grid" >
                    <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Releation</div>
                    <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                      {
                        relationTypes.includes(attribute.type.value) &&
                        <select className={styles['cm-selectbox']} name="relation" {...attribute.relation} value={attribute.relation.value}>
                        <option >Select {attribute.type.value} model</option>
                        {relations.map(relation => <option value={relation.name} key={relation.name} >{relation.name}</option>)}
                        </select>
                      }
                      {attribute.type.value === 'parent' &&
                        <RelationSelectBox relation={attribute.relationAttribute} model={attribute.relation.value} />
                      }
                    </div>
                  </div>
                </td>
                <td className="uk-text-center">
                  <div className="uk-grid" >
                    <div className={'uk-visible-small ' + styles['cm-attribute-text']}>Pattern</div>
                    <div className={'uk-width-7-10 ' + styles['cm-attribute-value']} >
                      <span className="uk-width-1-10" >/</span>
                      <input type="text" className={styles['cm-input'] + ' uk-width-6-10'} placeholder="Regular expression" {...attribute.pattern} />
                      <span className="uk-width-1-10" >/</span>
                      <input id={index + 'invalid-message-icon'} type="checkbox" className={styles['cm-text']} />
                      <label htmlFor={index + 'invalid-message-icon'} className={'uk-width-2-10 ' + styles['cm-icon'] + ' ' + styles['cm-icon-pattern']} >
                      <i className="uk-icon-file-text-o uk-icon-small" />
                      </label>
                      <p className={styles['cm-text-area']} >
                      <textarea className={styles['cm-input'] + ' uk-width-1-1'} placeholder="Invalid message" {...attribute.invalid}/>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="uk-text-center">
                  <a onClick={event => {
                    event.preventDefault(); // prevent form submission
                    attributes.removeField(index);    // pushes empty child field onto the end of the array
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
                <button className={'uk-button ' + styles['cm-row-plus']} onClick={event => {
                  event.preventDefault(); // prevent form submission
                  attributes.addField();    // pushes empty child field onto the end of the array
                }}>
                  <i className="uk-icon-plus uk-icon-small"></i>
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
        <button className={'uk-button uk-button-primary uk-button-large ' + styles['cm-button']}
          onClick={handleSubmit(() => {
            loadPage();
            return save(app, model.value, values)
              .then(() => {
                restartPage();
              })
              .catch(() => {
                restartPage();
              });
          })}
        >
          <i className={'uk-icon-floppy-o ' + styles['cm-icon']}/>
          Save
        </button>
      </form>
    );
  }
}
