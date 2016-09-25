import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import fs from 'fs-extra';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import createStore from './create';
import {load} from './modules/i18n';
import ApiClient from 'promise-apiclient';
import Fetcher from 'redux-fetch-dispatcher';
import Html from './containers/Html';
import PrettyError from 'pretty-error';
import http from 'http';
import recursive from 'recursive-readdir';
import uris from './uris';
import network from './network';

import { match } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from './routes';

import bodyParser from 'body-parser';
import creator from 'express-restful-api';
import admin from './admin';
import apikit from './apikit';
import mongoose from 'mongoose';
const i18n = {};
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'images', 'favicon.png')));

app.use(Express.static(path.join(__dirname, '..', 'static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', creator.router({
  mongo: mongoose,
  schema: admin,
  cors: false,
  prefix: uris.admin.root
}));

mongoose.connect(config.mongoURL || process.env.CHAUS_MONGO_URL || process.env.MONGOLAB_URI );

const retatch = (req, res)=>{
  mongoose.models = {};
  mongoose.modelSchemas = {};
  apikit(app, mongoose);
  if (res) {
    res.json({ok: true});
  }
};
app.get(uris.admin.restart, retatch);
retatch();

network(app);

recursive( __dirname + '/../i18n', (err, files) => {
  files.map(file => {
    console.log('### loading lang files');
    const messages = fs.readJsonSync( file, {throws: false});
    const lang = path.basename(file, '.json');
    i18n[lang] = messages;
  });
});

app.use(uris.apps.apps, (req, res) => {
  load( i18n[req.params.lang] );
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient({
    cookie: req.get('cookie'),
    origin: uris.base,
    referer: uris.base
  });
  const history = createHistory(req.originalUrl);

  const store = createStore(history);

  const fetcher = new Fetcher({
    client,
    dispatch: store.dispatch,
    urls: uris.resources
  });

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {fetcher}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} store={store} />
          </Provider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.get('/', (req, res)=>{
  res.redirect(uris.apps.defaults);
});

if (config.port) {

  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server.', config.app.title);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
