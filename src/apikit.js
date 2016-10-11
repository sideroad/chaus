import {} from 'isomorphic-fetch';
import config from './config';
import creator from 'express-restful-api';
import fs from 'fs';
import cors from 'cors';
import wildcard from 'wildcard';
import express from 'express';
import uris from './uris';
import __ from 'lodash';
import { stringify } from 'koiki';
const version = JSON.parse( fs.readFileSync( __dirname + '/../package.json') ).version;
const routes = {};
let creators = [];

function fetchApps(application) {
  console.log('Loading apps...', application);
  return fetch( config.global.base + stringify(uris.admin.app, {
    app: application
  }) + '?limit=1000', {
    method: 'GET'
  }).then(res => res.json())
    .then(app => {
      return fetch( config.global.base + uris.admin.origins + '?app=' + encodeURIComponent( application ) + '&limit=1000', {
        method: 'GET'
      }).then(res => res.json())
        .then(origins=>{
          app.origins = origins.items.map(origin=> origin.url);
          return app;
        });
    })
    .catch(err => console.error(err));
}

function fetchModels() {
  console.log('Loading models...');
  return fetch( config.global.base + uris.admin.models + '?limit=10000', {
    method: 'GET'
  }).then(res => res.json())
    .catch(err => console.error(err));
}

function fetchAttributes() {
  console.log('Loading attributes...');
  return fetch( config.global.base + uris.admin.attributes + '?limit=10000', {
    method: 'GET'
  }).then(res => res.json())
    .catch(err => console.error(err));
}

function convert(models, attributes) {
  const dist = {};
  attributes.map(attribute => {
    const app = attribute.app;
    if ( !dist[app] ) {
      dist[app] = {};
    }

    const model = __.find(models, {app: {id: app}, id: attribute.model.id});
    if (!model) {
      return;
    }
    if ( !dist[app][model.name] ) {
      dist[app][model.name] = {};
    }

    const name = attribute.name;
    const relation = __.find(models, {app: {id: app}, id: attribute.relation.id});
    switch (attribute.type) {
      case 'children':
        attribute.relation = relation ? relation.name : null;
        break;
      case 'instance':
        attribute.relation = relation ? relation.name : null;
        break;
      case 'parent':
        attribute.relation = relation ? relation.name + '.' + attribute.relationAttribute : null;
        break;
      default:
        attribute.relation = null;
    }
    delete attribute.id;
    delete attribute.name;
    delete attribute.model;
    delete attribute.relationAttribute;
    dist[app][model.name][name] = attribute;
  });
  return dist;
}

export default function(app, mongoose) {
  console.log('Loading APIs...');
  creators.map(_creator => _creator.destroy());
  creators = [];
  fetchModels()
    .then(models => {
      fetchAttributes()
        .then(attributes=> {
          const schema = convert(models.items, attributes.items);
          Object.keys(schema).forEach(application => {
            fetchApps(application)
              .then(settings=> {
                const path = stringify(uris.apis.root, { app: application });

                console.log('Apply CORS settings...', path, settings.origins);
                if ( !routes[application] ) {
                  const router = express.Router();
                  routes[application] = ()=>{};
                  router.use(path, cors({
                    origin: (origin, callback) => {
                      routes[application](origin, callback);
                    },
                    credentials: true
                  }));
                  app.use(router);
                }
                routes[application] = (origin, callback)=>{
                  callback(null, settings.origins.reduce(
                    (memo, _url)=> {
                      return ( wildcard(_url, origin) ? true : false ) || memo;
                    }, false)
                  );
                };

                app.use('/', creator.router({
                  mongo: mongoose,
                  schema: schema[application],
                  cors: true,
                  prefix: path
                }));

                creator.doc({
                  'name': application,
                  version,
                  'description': settings.description,
                  'title': application,
                  'url': config.global.base,
                  'sampleUrl': config.global.base,
                  'template': {
                    'withCompare': false,
                    'withGenerator': true
                  },
                  'dest': __dirname + '/../static/docs/' + application
                });

                fs.writeFileSync( __dirname + '/../static/docs/' + application + '/schema.json', JSON.stringify(schema[application]), 'utf8');
                creators.push(creator);
              });
          });
        });
    })
    .catch(err => console.error(err));
}
