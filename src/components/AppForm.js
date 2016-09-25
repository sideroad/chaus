import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';

@reduxForm({
  form: 'apps',
  fields: [
    'app'
  ]
})
export default class AppForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    candidate: PropTypes.string,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onTab: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onEnter: PropTypes.func.isRequired
  };

  render() {
    const {
      values,
      fields,
      candidate,
      onPrev,
      onNext,
      onTab,
      onChange,
      onEnter
    } = this.props;
    const styles = {
      base: require('../css/customize.less'),
      app: require('../css/app.less')
    };
    const submit = (app) => {
      onEnter(app);
    };
    const search = (query) => {
      onChange(query);
    };

    return (
      <div className={styles.app.box}>
        <div className={styles.app.candidate}>{candidate}</div>
        <input
          {...fields.app}
          className={styles.app.input + ' ' + styles.base['cm-input']}
          onKeyDown={
            (evt) => {
              switch (evt.key) {
                case 'Enter':
                  submit(evt.target.value);
                  break;
                case 'Tab':
                  onTab(candidate);
                  fields.app.value = candidate;
                  values.app = candidate;
                  evt.preventDefault();
                  break;
                case 'ArrowUp':
                  onPrev();
                  evt.preventDefault();
                  break;
                case 'ArrowDown':
                  onNext();
                  evt.preventDefault();
                  break;
                default:
              }
            }
          }
          onChange={
            (evt) => {
              search(evt.target.value);
            }
          }
        />
        <img
          src={require('../images/glass.png')}
          className={styles.app.glass}
          onClick={
            ()=>{
              submit(fields.app.value);
            }
          }
        />
      </div>
    );
  }
}
