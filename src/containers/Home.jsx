import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { stringify } from 'koiki';

import Hero from '../components/Hero';
import Explanation from '../components/Explanation';
import Footer from '../components/Footer';
import uris from '../uris';
import config from '../config';

const Home = props =>
  <div>
    <Helmet {...config.app.head} title="Dead Simple REST API in 1 minute" />
    <Hero
      onLogin={() => props.login(props.lang)}
    />
    <Explanation />
    <Footer />
  </div>;

Home.propTypes = {
  lang: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
};

const connected = connect(
  (state, ownProps) => ({
    lang: ownProps.params.lang,
  }),
  dispatch => ({
    login: lang => dispatch(push(stringify(uris.pages.apps, { lang })))
  })
)(Home);

export default connected;
