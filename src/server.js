import { server } from 'koiki';
import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import __ from 'lodash';
import path from 'path';
import http from 'http';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import PrettyError from 'pretty-error';
import creator from 'express-restful-api';
import { v4 } from 'uuid';

import config from './config';
import urls from './urls';
import uris from './uris';
import network from './network';
import routes from './routes';
import admin from './admin';
import apikit from './apikit';
import reducers from './reducers';
import passporter from './helpers/passporter';

const app = new Express();
const pretty = new PrettyError();
const token = v4();

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'images', 'favicon.png')));

app.use(Express.static(path.join(__dirname, '..', 'static')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
passporter.use(app);

app.use('/', creator.router({
  mongo: mongoose,
  schema: admin,
  cors: false,
  prefix: uris.admin.root,
  before: (req, res, next, key, schemas) => {
    const store = req.method === 'GET' ? 'query' : 'body';

    // If the access comes from server for retatch apikit, proceed
    if (req.headers['x-chaus-token'] === token) {
      next();
      return;
    }
    const user = config.github.enabled ? req.user : { id: 'anonymous' };

    if (req.isAuthenticated() || !config.github.enabled) {
      // GET method should be authenticated in after method.
      if (req.method === 'GET') {
        next();
        return;
      }
      // POST app API should be allow to create app
      if (key === 'app' &&
          req.method === 'POST' &&
          !req.params.id
      ) {
        next();
        return;
      }
      schemas.allow.findOne({
        app: req[store][key === 'app' ? 'id' : 'app'] ||
             req.params[key === 'app' ? 'id' : ''],
        user: user.id
      }, (err, instance) => {
        if (!err && instance) {
          next();
        } else {
          res.status(401).json({
            errors: [
              { message: 'Forbidden' }
            ]
          });
        }
      });
    } else {
      res.status(401).json({});
    }
  },
  after: (req, res, json, key, schemas) => {
    const user = config.github.enabled ? req.user : { id: 'anonymous' };

    const send = (_json) => {
      if (_json) {
        res.json(_json);
      } else {
        res.send(null);
      }
    };

    // If the access comes from server for retatch apikit, proceed
    if (req.headers['x-chaus-token'] === token) {
      send(json);
      return;
    }

    // POST app API should put allow user which created the app
    // POST app API should put client which create the app
    if (key === 'app' &&
        req.method === 'POST') {
      new schemas.allow({
        app: req.body.name,
        user: user.id
      }).save((err) => {
        if (err) {
          res.status(400).json({
            errors: [{
              message: err
            }]
          });
        } else {
          send(json);
        }
      });
    } else if (req.method === 'GET') {
      schemas.allow.find({ user: user.id }, (err, collection) => {
        // GET collections
        if (json.items) {
          send({
            ...json,
            items: json.items.filter(item => __.find(collection, {
              app: key === 'app' ? item.id :
                     item.app.id ? item.app.id : item.app
            }))
          });

        // GET instance
        } else {
          const isPermitted = __.find(collection, {
            app: key === 'app' ? json.id :
                   json.app.id ? json.app.id : json.app
          });
          if (isPermitted) {
            send(json);
          } else {
            res.status(400).json({
              errors: [{
                message: 'Unauthorized'
              }]
            });
          }
        }
      });
    } else {
      send(json);
    }
  }
}));

mongoose.connect(config.mongoURL);

const retatch = (req, res) => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  apikit(app, mongoose, token);
  if (res) {
    res.json({ ok: true });
  }
};
app.get(uris.admin.restart, retatch);
retatch();

network(app);

server({
  urls,
  reducers,
  routes,
  isDevelopment: __DEVELOPMENT__,
  app,
  path: uris.pages.root,
  origin: config.global.base,
  i18ndir: `${__dirname}/../i18n`,
  statics: config.app.statics,
  handlers: {
    error: error => console.error('ROUTER ERROR:', pretty.render(error))
  },
  manifest: {
    name: config.app.title,
    description: config.app.description,
    background_color: '#595455'
  }
});

if (config.port) {

  new http.Server(app).listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server.', config.app.title);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
