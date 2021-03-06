import { server, passporter } from 'koiki';
import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import __ from 'lodash';
import path from 'path';
import http from 'http';
import mongoose from 'mongoose';
import creator from 'express-restful-api';
import { v4 } from 'uuid';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import config from './config';
import urls from './urls';
import uris from './uris';
import network from './helpers/network';
import jsonLoader from './helpers/json-loader';
import routes from './routes';
import admin from './admin';
import apikit from './apikit';
import reducers from './reducers';

const app = new Express();
const token = v4();

mongoose.Promise = Promise;

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'images', 'favicon.png')));
app.use(Express.static(path.join(__dirname, '..', 'static')));

if (config.github.enabled) {
  passporter.use({ github: config.github }, app, config.global.base);
} else {
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
}

app.use(
  '/',
  creator.router({
    mongo: mongoose,
    schemas: admin,
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
        if (key === 'app' && req.method === 'POST' && !req.params.id) {
          next();
          return;
        }
        schemas.allow.findOne(
          {
            app: req[store][key === 'app' ? 'id' : 'app'] || req.params[key === 'app' ? 'id' : ''],
            user: user.id
          },
          (err, instance) => {
            if (!err && instance) {
              next();
            } else {
              res.status(401).json({
                errors: [{ message: 'Forbidden' }]
              });
            }
          }
        );
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
      if (key === 'app' && req.method === 'POST') {
        new schemas.allow({
          app: req.body.name,
          user: user.id
        }).save((err) => {
          if (err) {
            res.status(400).json({
              errors: [
                {
                  message: err
                }
              ]
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
              items: json.items.filter(item =>
                __.find(collection, {
                  app: key === 'app' ? item.id : item.app.id ? item.app.id : item.app
                })
              )
            });

            // GET instance
          } else {
            const isPermitted = __.find(collection, {
              app: key === 'app' ? json.id : json.app.id ? json.app.id : json.app
            });
            if (isPermitted) {
              send(json);
            } else {
              res.status(400).json({
                errors: [
                  {
                    message: 'Unauthorized'
                  }
                ]
              });
            }
          }
        });
      } else {
        send(json);
      }
    }
  })
);

mongoose.connect(
  config.mongoURL,
  {
    useMongoClient: true
  }
);

let router = (req, res, next) => {
  next();
};
app.use((req, res, next) => {
  router(req, res, next);
});

const retatch = (req, res) => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  apikit(mongoose, token).then((_routers) => {
    const newRouter = Express.Router();
    _routers.forEach((_router) => {
      newRouter.use(_router.corsRouter);
      newRouter.use(_router.router);
    });
    router = newRouter;
  });
  if (res) {
    res.json({ ok: true });
  }
};
app.get(uris.admin.restart, retatch);
retatch();

network(app);
jsonLoader(app);

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
    error: error => console.error(error)
  },
  manifest: {
    name: config.app.title,
    short_name: config.app.title,
    description: config.app.description
  },
  colors: {
    background: '#595455',
    primary: '#FFFFFC',
    secondary: '#8DB530'
  }
});

if (config.port) {
  new http.Server(app).listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server.', config.app.title);
    console.info(
      '==> 💻  Open http://%s:%s in a browser to view the app.',
      config.host,
      config.port
    );
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
