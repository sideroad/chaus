import React from 'react';
import PropTypes from 'prop-types';
import { IndexLink } from 'react-router';

const styles = require('../css/card.less');

const Card = props =>
  <div className={styles.items}>
    {
      props.items.map(item =>
        <div key={item.id} className={styles.item} >
          <IndexLink
            className={`${styles.card} ${props.candidate === item.id ? styles.selected : ''}`}
            to={item.url}
          >
            <div className={styles.primary}>
              <div className={styles.name} >
                {item.name}
              </div>
            </div>
          </IndexLink>
        </div>
      )
    }
    {
      !props.query &&
      !props.items.length ?
        <div className={styles.lead}>
          {props.lead.start}
        </div>
      : ''
    }
    {
      props.query &&
      !props.items.length ?
        <div className={styles.lead}>
          {props.lead.create}
        </div>
      : ''
    }
  </div>;

Card.propTypes = {
  items: PropTypes.array,
  query: PropTypes.string,
  candidate: PropTypes.string,
  lead: PropTypes.object
};

Card.defaultProps = {
  items: [],
};

export default Card;
