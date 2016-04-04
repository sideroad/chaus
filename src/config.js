require('babel-polyfill');

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

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  global: {
    host: process.env.CHAUS_HOST || process.env.URL,
    port: process.env.CHAUS_PORT
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
        {property: 'og:image', content: 'https://restful-api-kit.herokuapp.com/images/logo.png'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: title},
        {property: 'og:description', content: description},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@side_road'},
        {property: 'og:creator', content: '@side_road'},
        {property: 'og:image:width', content: '300'},
        {property: 'og:image:height', content: '300'}
      ]
    }
  }
}, environment);
