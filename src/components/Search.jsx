import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'koiki-ui';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = { value: props.query };
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
    const styles = require('../css/search.less');

    const submit = (app) => {
      onEnter(app);
    };
    const search = (_query) => {
      onChange(_query);
    };

    return (
      <div className={styles.box}>
        <div className={styles.candidate}>{candidate}</div>
        <div className={styles.input}>
          <Input
            value={value}
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
                this.setState({ value: event.target.value });
                search(evt.target.value);
              }
            }
            styles={{
              fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
              input: require('../css/koiki-ui/input.less')
            }}
          />
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  candidate: PropTypes.string,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onTab: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  query: PropTypes.string
};


export default Search;
