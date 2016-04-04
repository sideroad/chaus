import {} from 'isomorphic-fetch';
import config from './config';
import creator from 'express-restful-api';
import fs from 'fs';

function fetchModels() {
  console.log('Loading models...');
  return fetch( 'http://' + config.host + ':' + config.port + '/admin/api/models', {
    method: 'GET'
  }).then(res => res.json())
    .catch(err => console.error(err));
}

function fetchAttributes(model) {
  console.log('Loading ' + model.name + ' attributes...');
  return fetch( 'http://' + config.host + ':' + config.port + '/admin/api/attributes?model=' + model.name, {
    method: 'GET'
  }).then(res => res.json())
    .then(attributes => {
      model.attributes = attributes.items;
      return model;
    })
    .catch(err => console.error(err));
}

function convert(source) {
  const dist = {};
  source.map(model => {
    const attr = {};
    model.attributes.map(attribute=>{
      const name = attribute.name;
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
    });
    dist[model.name] = attr;
  });
  return dist;
}

// TODO: [BUG]Should be able to detach

export default function(app, mongoose) {
  console.log('Loading APIs...');
  fetchModels()
    .then(models=> {
      const promises = models.items.map(model=> fetchAttributes(model));
      return Promise.all(promises);
    })
    .then(models=> {
      const schema = convert(models);

      app.use('/', creator.router({
        mongo: mongoose,
        schema: schema,
        cors: true
      }));

      creator.doc({
        'name': 'RESTful API',
        'version': JSON.parse( fs.readFileSync( __dirname + '/../package.json') ).version,
        'description': 'API specification',
        'title': 'API doc',
        'url': '//' + config.global.host,
        'sampleUrl': '//' + config.global.host,
        'template': {
          'withCompare': false,
          'withGenerator': true
        },
        'dest': __dirname + '/../static/doc'
      });
    })
    .catch(err => console.error(err));
}
