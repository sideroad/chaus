import React from 'react';
import PropTypes from 'prop-types';

const styles = require('../css/explanation.less');
const fa = require('../css/koiki-ui/fa/less/font-awesome.less');

const Explanation = props =>
  <div
    className={styles.explanation}
  >
    <ul className={styles.list} >
      {
        props.items.map(item =>
          <li key={item.lead} className={styles.item} >
            <i className={`${fa.fa} ${fa[item.icon]} ${styles.icon}`} />
            <div className={styles.lead} >
              {item.lead}
            </div>
            <div className={styles.sublead} >
              {item.sublead}
            </div>
          </li>
        )
      }
    </ul>
  </div>;

Explanation.propTypes = {
  items: PropTypes.array
};

Explanation.defaultProps = {
  items: [
    {
      icon: 'fa-cube',
      lead: 'RESTful API Generation',
      sublead: 'Make your application models, properties and make relation with other models.'
    },
    {
      icon: 'fa-book',
      lead: 'Document Generation',
      sublead: 'Every endpoint specifications and sample request can be make on the page.'
    },
    {
      icon: 'fa-cogs',
      lead: 'Browser, Server Support',
      sublead: 'CORS setting for browser use. Generate API Key for server use.'
    },
    {
      icon: 'fa-check-circle-o',
      lead: 'Validation Support',
      sublead: 'Provide JSON schema, validation for FrontEnd validation.'
    },
  ]
};

export default Explanation;
