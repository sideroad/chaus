import {} from 'isomorphic-fetch';
import config from './config';
import creator from 'express-restful-api';
import fs from 'fs';
import url from 'url';

function fetchAttributes() {
  console.log('Loading attributes...');
  return fetch( 'http://' + config.host + ':' + config.port + '/admin/api/attributes', {
    method: 'GET'
  }).then(res => res.json())
    .catch(err => console.error(err));
}

function convert(source) {
  const dist = {};
  console.log(source);
  source.map(attribute => {
    if ( !dist[attribute.app] ) {
      dist[attribute.app] = {};
    }

    const attr = {};
    const name = attribute.name;
    const model = attribute.model;
    delete attribute.id;
    delete attribute.name;
    delete attribute.model;
    attribute.uniq = attribute.uniq === 'true' ? true : false;
    attribute.required = attribute.required === 'true' ? true : false;
    const relation = attribute.relation;
    if ( attribute.relationAttribute ) {
      attribute.relation = relation + '.' + attribute.relationAttribute;
    } else {
      attribute.relation = relation;
    }
    attr[name] = attribute;
    dist[attribute.app][model] = attr;
  });
  return dist;
}

// TODO: [BUG]Should be able to detach

export default function(app, mongoose) {
  console.log('Loading APIs...');
  fetchAttributes()
    .then(attributes=> {
      const schema = convert(attributes.items);
      console.log(schema);
      Object.keys(schema).map(application => {
        console.log(application, schema[application]);
        app.use('/', creator.router({
          mongo: mongoose,
          schema: schema[application],
          cors: true,
          prefix: '/apis/' + application
        }));

        creator.doc({
          'name': 'RESTful API',
          'version': JSON.parse( fs.readFileSync( __dirname + '/../package.json') ).version,
          'description': 'API specification',
          'title': 'API doc',
          'url': url.format({
            hostname: config.global.host,
            port: config.global.port
          }),
          'sampleUrl': url.format({
            hostname: config.global.host,
            port: config.global.port
          }),
          'template': {
            'withCompare': false,
            'withGenerator': true
          },
          'dest': __dirname + '/../static/docs/' + application
        });

      });
    })
    .catch(err => console.error(err));
}
