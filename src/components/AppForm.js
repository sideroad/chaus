import React, { Component, PropTypes } from 'react';

class AppForm extends Component {

  constructor(props) {
    super(props);
    this.state = {value: props.query};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.query
    });
  }

  render() {
    const {
      candidate,
      onPrev,
      onNext,
      onTab,
      onChange,
      onEnter,
    } = this.props;
    const {
      value
    } = this.state;
    const styles = {
      base: require('../css/customize.less'),
      app: require('../css/app.less')
    };
    const submit = (app) => {
      onEnter(app);
    };
    const search = (_query) => {
      onChange(_query);
    };

    return (
      <div className={styles.app.box}>
        <div className={styles.app.candidate}>{candidate}</div>
        <input
          value={value}
          ref={(elem) => { this.inputDOM = elem; }}
          className={styles.app.input + ' ' + styles.base.input}
          onKeyDown={
            (evt) => {
              switch (evt.key) {
                case 'Enter':
                  submit(evt.target.value);
                  break;
                case 'Tab':
                  onTab(candidate);
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
              this.setState({value: event.target.value});
              search(evt.target.value);
            }
          }
          type="text"
        />
        <img
          src={require('../images/glass.png')}
          className={styles.app.glass}
          onClick={
            () => submit(this.inputDOM.value)
          }
        />
      </div>
    );
  }
}

AppForm.propTypes = {
  candidate: PropTypes.string,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onTab: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  query: PropTypes.string
};


export default AppForm;
