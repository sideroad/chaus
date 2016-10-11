import {server} from 'koiki';
import Express from 'express';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import http from 'http';
import urls from './urls';
import uris from './uris';
import network from './network';
import routes from './routes';
import bodyParser from 'body-parser';
import creator from 'express-restful-api';
import admin from './admin';
import apikit from './apikit';
import mongoose from 'mongoose';
import reducers from './reducers';
import PrettyError from 'pretty-error';

const app = new Express();
const pretty = new PrettyError();

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

server({
  urls,
  reducers,
  routes,
  isDevelopment: __DEVELOPMENT__,
  app,
  path: uris.pages.root,
  origin: config.global.base,
  i18ndir: __dirname + '/../i18n',
  statics: config.app.statics,
  handlers: {
    error: error => {
      console.error('ROUTER ERROR:', pretty.render(error));
    }
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
