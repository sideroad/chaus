import React, {Component, PropTypes} from 'react';
import {IndexLink} from 'react-router';


export default class Card extends Component {
  static propTypes = {
    items: PropTypes.array,
    query: PropTypes.string,
    candidate: PropTypes.string,
    lead: PropTypes.object
  };

  render() {
    const {
      items,
      query,
      candidate,
      lead
    } = this.props;

    const styles = {
      base: require('../css/customize.less'),
      card: require('../css/card.less')
    };

    return (
      <div className={styles.card.items}>
        {items && items.map(item => (
          <div key={item.id} className={styles.card.item} >
            <IndexLink
              className={styles.card.card + ' ' + (candidate === item.id ? styles.card.selected : '')}
              to={item.url}
            >
              <div className={styles.card.primary}>
                <div className={styles.card.name} >
                  {item.name}
                </div>
              </div>
            </IndexLink>
          </div>
        ))}
        {!query &&
         !items.length ?
          <div className={styles.card.lead}>
            {lead.start}
          </div>
         : ''}
         {query &&
          !items.length ?
           <div className={styles.card.lead}>
             {lead.create}
           </div>
          : ''}
        </div>
    );
  }
}
