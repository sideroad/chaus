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
      sublead: 'Make your application resources, attributions. Each resource can make relation with other resources.'
    },
    {
      icon: 'fa-sort-amount-desc',
      lead: 'Collection Fetch Control',
      sublead: 'Be able to change sort order to fetch collectin. Be able to filter collection by request parameter. exact match, wildcard, range can be used.',
    },
    {
      icon: 'fa-random',
      lead: 'Field Fetch Control',
      sublead: 'Be able to narrow response field, expand field which has parent or parent relation resource.',
    },
    {
      icon: 'fa-book',
      lead: 'API Document Automation',
      sublead: 'API I/F page will generated automatically.'
    },
    {
      icon: 'fa-cogs',
      lead: 'Browser, Server Support',
      sublead: 'CORS setting for browser use. Generate API Key for server use.'
    },
    {
      icon: 'fa-check-circle-o',
      lead: 'Validation Support',
      sublead: 'Provide JSON schema, Validation End Point.'
    },
  ]
};

export default Explanation;
