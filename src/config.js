require('babel-polyfill');
const normalize = require('koiki').normalize;

const title = 'chaus';
const description = 'Build RESTful API within 5 min';

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const globalHost = process.env.GLOBAL_HOST || 'localhost';
const globalPort = Number( process.env.GLOBAL_PORT || 3000 );
const globalBase = normalize( globalHost + ':' + globalPort );

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: Number( process.env.PORT || 3000 ),
  global: {
    host: globalHost,
    port: globalPort,
    base: globalBase
  },
  github: {
    appId: process.env.CHAUS_GITHUB_CLIENT_ID,
    secret: process.env.CHAUS_GITHUB_CLIENT_SECRET,
  },
  mongoURL: '', // If you want to set MongoURL on config, please set here otherwise, process.env.CHAUS_MONGO_URL will be used.
  app: {
    title: title,
    description: description,
    head: {
      titleTemplate: title + ' - %s',
      meta: [
        {name: 'description', content: description},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: title},
        {property: 'og:image', content: 'https://chaus.herokuapp.com/images/logo.png'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: title},
        {property: 'og:description', content: description},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@side_road'},
        {property: 'og:creator', content: '@side_road'},
        {property: 'og:image:width', content: '300'},
        {property: 'og:image:height', content: '300'}
      ]
    },
    statics: {
      link: [
        {rel: 'shortcut icon', href: '/images/favicon.png'},
        {rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=PT+Sans', },
        {rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/uikit/2.24.3/css/uikit.min.css' },
        {rel: 'stylesheet', type: 'text/css', href: '/css/base.css' }
      ]
    }
  }
}, environment);
