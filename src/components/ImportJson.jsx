import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

const styles = require('../css/import-json.less');

class ImportJson extends Component {
  constructor() {
    super();
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    const promises = files.map(file =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(JSON.parse(event.target.result));
        };
        reader.readAsText(file);
      })
    );
    Promise.all(promises).then(results => this.props.onDropFiles(results));
  }

  render() {
    return (
      <Dropzone
        className={styles.importJson}
        accept="application/json"
        onDrop={this.onDrop}
      >
        {this.props.children}
      </Dropzone>
    );
  }
}

ImportJson.propTypes = {
  children: PropTypes.element.isRequired,
  onDropFiles: PropTypes.func.isRequired
};

export default ImportJson;
