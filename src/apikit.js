import {} from 'isomorphic-fetch';
import config from './config';
import creator from 'express-restful-api';
import fs from 'fs';
import cors from 'cors';
import url from 'url';
import wildcard from 'wildcard';
import express from 'express';
import uris from './uris';
const version = JSON.parse( fs.readFileSync( __dirname + '/../package.json') ).version;
const routes = {};
let creators = [];


function fetchApps(application) {
  console.log('Loading apps...', application);
  return fetch( 'http://' + config.host + ':' + config.port + uris.normalize(uris.admin.app, {
    app: application
  }), {
    method: 'GET'
  }).then(res => res.json())
    .then(app => {
      return fetch( 'http://' + config.host + ':' + config.port + uris.admin.origins + '?app=' + encodeURIComponent( application ), {
        method: 'GET'
      }).then(res => res.json())
        .then(origins=>{
          app.origins = origins.items.map(origin=> origin.url);
          return app;
        });
    })
    .catch(err => console.error(err));
}

function fetchAttributes() {
  console.log('Loading attributes...');
  return fetch( 'http://' + config.host + ':' + config.port + uris.admin.attributes, {
    method: 'GET'
  }).then(res => res.json())
    .catch(err => console.error(err));
}

function convert(source) {
  const dist = {};
  source.map(attribute => {
    if ( !dist[attribute.app] ) {
      dist[attribute.app] = {};
    }
    if ( !dist[attribute.app][attribute.model] ) {
      dist[attribute.app][attribute.model] = {};
    }

    const name = attribute.name;
    const model = attribute.model;
    delete attribute.id;
    delete attribute.name;
    delete attribute.model;
    const relation = attribute.relation;
    if ( attribute.relationAttribute ) {
      attribute.relation = relation + '.' + attribute.relationAttribute;
    } else {
      attribute.relation = relation;
    }
    dist[attribute.app][model][name] = attribute;
  });
  return dist;
}

export default function(app, mongoose) {
  console.log('Loading APIs...');
  creators.map(_creator => _creator.destroy());
  creators = [];
  fetchAttributes()
    .then(attributes=> {
      const schema = convert(attributes.items);
      Object.keys(schema).forEach(application => {
        fetchApps(application)
          .then(settings=> {
            const path = uris.normalize(uris.apis.root, { app: application });

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
              'url': url.format({
                protocol: config.global.port === 443 ? 'https:' : 'http:',
                hostname: config.global.host,
                port: config.global.port === 443 || config.global.port === 80 ? '' : config.global.port
              }),
              'sampleUrl': url.format({
                protocol: config.global.port === 443 ? 'https:' : 'http:',
                hostname: config.global.host,
                port: config.global.port === 443 || config.global.port === 80 ? '' : config.global.port
              }),
              'template': {
                'withCompare': false,
                'withGenerator': true
              },
              'dest': __dirname + '/../static/docs/' + application
            });
            creators.push(creator);
          });
      });
    })
    .catch(err => console.error(err));
}
