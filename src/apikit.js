import {} from 'isomorphic-fetch';
import creator from 'express-restful-api';
import fs from 'fs';
import cors from 'cors';
import wildcard from 'wildcard';
import express from 'express';
import __ from 'lodash';
import { stringify } from 'koiki';
import config from './config';
import uris from './uris';

const version = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`)).version;
const routes = {};
let creators = [];

function fetchApps(application, token) {
  console.log('Loading apps...', application);
  return fetch(`${config.global.base}${stringify(uris.admin.app, {
    app: application
  })}?limit=1000`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'x-chaus-token': token
    }
  }).then(res => res.json())
    .then(app =>
      fetch(`${config.global.base}${uris.admin.origins}?app=${encodeURIComponent(application)}&limit=1000`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'x-chaus-token': token
        }
      }).then(res => res.json())
        .then(origins => ({
          ...app,
          origins: origins.items.map(origin => origin.url)
        })
      )
    )
    .catch(err => console.error(err));
}

function fetchModels(token) {
  console.log('Loading models...');
  return fetch(`${config.global.base}${uris.admin.models}?limit=10000`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'x-chaus-token': token
    }
  }).then(res => res.json())
    .catch(err => console.error(err));
}

function fetchAttributes(token) {
  console.log('Loading attributes...');
  return fetch(`${config.global.base}${uris.admin.attributes}?limit=10000`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'x-chaus-token': token
    }
  }).then(res => res.json())
    .catch(err => console.error(err));
}

function convert(models, attributes) {
  const dist = {};
  attributes.forEach((attribute) => {
    const app = attribute.app;
    if (!dist[app]) {
      dist[app] = {};
    }

    const model = __.find(models, { app: { id: app }, id: attribute.model.id });
    if (!model) {
      return;
    }
    if (!dist[app][model.name]) {
      dist[app][model.name] = {};
    }

    const name = attribute.name;
    const relation = __.find(models, { app: { id: app }, id: attribute.relation.id });
    dist[app][model.name][name] = {
      app: attribute.app,
      type: attribute.type,
      uniq: attribute.uniq,
      required: attribute.required,
      pattern: attribute.pattern,
      invalid: attribute.invalid,
      desc: attribute.desc,
      createdAt: attribute.createdAt,
      updatedAt: attribute.updatedAt,
      relation: attribute.type === 'children' && relation ? relation.name :
                attribute.type === 'instance' && relation ? relation.name :
                attribute.type === 'parent' && relation ? `${relation.name}.${attribute.relationAttribute}`
                : null,
    };
  });
  return dist;
}

export default function (app, mongoose, token) {
  console.log('Loading APIs...');
  creators.map(_creator => _creator.destroy());
  creators = [];
  fetchModels(token)
    .then((models) => {
      fetchAttributes(token)
        .then((attributes) => {
          const schema = convert(models.items, attributes.items);
          Object.keys(schema).forEach((application) => {
            fetchApps(application, token)
              .then((settings) => {
                const path = stringify(uris.apis.root, { app: application });

                console.log('Apply CORS settings...', path, settings.origins);
                if (!routes[application]) {
                  const router = express.Router();
                  routes[application] = () => {};
                  router.use(path, cors({
                    origin: (origin, callback) => {
                      routes[application](origin, callback);
                    },
                    credentials: true
                  }));
                  app.use(router);
                }
                routes[application] = (origin, callback) => {
                  callback(null, settings.origins.reduce(
                    (memo, _url) =>
                      console.log(_url, origin, wildcard(_url, origin)) ||
                      wildcard(_url, origin) || memo
                    , false)
                  );
                };

                console.log(`${application} construct schema`, schema[application]);
                app.use('/', creator.router({
                  mongo: mongoose,
                  schema: schema[application],
                  cors: true,
                  prefix: path,
                  client: settings.client,
                  secret: settings.secret
                }));

                creator.doc({
                  name: application,
                  version,
                  description: settings.description,
                  title: application,
                  url: config.global.base,
                  sampleUrl: config.global.base,
                  template: {
                    withCompare: false,
                    withGenerator: true
                  },
                  dest: `${__dirname}/../static/docs/${application}`
                });

                fs.writeFileSync(`${__dirname}/../static/docs/${application}/schema.json`, JSON.stringify(schema[application]), 'utf8');
                creators.push(creator);
              })
              .catch(err => console.error(err));
          });
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}
