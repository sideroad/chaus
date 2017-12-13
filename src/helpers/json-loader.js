import {} from 'isomorphic-fetch';
import hyphenize from 'hyphenize';
import uris from '../uris';
import config from '../config';
import attributify from './attributify';

function postModel(req, scheme) {
  const body = {
    app: req.params.app,
    name: hyphenize(scheme.title || scheme.id)
  };
  console.log('POST model...', scheme);
  return fetch(`http://${config.host}:${config.port}${uris.admin.models}`, {
    method: 'POST',
    body: JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      cookie: `connect.sid=${req.cookies['connect.sid']}`
    }
  }).then(res => console.log(res.ok) || res.json())
    .catch(err => console.error(err));
}

function postAttributes(req, body) {
  console.log('POST attributes...', body);
  return fetch(`http://${config.host}:${config.port}${uris.admin.attributes}`, {
    method: 'POST',
    body: JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      cookie: `connect.sid=${req.cookies['connect.sid']}`
    }
  }).then(res => console.log(res.ok) || res.json())
    .catch(err => console.error(err));
}

export default (app) => {
  app.post(uris.admin.jsonLoader, (req, res) => {
    const promises = req.body.schemes.map(scheme =>
      new Promise((resolve) => {
        postModel(req, scheme)
          .then((json) => {
            console.log(json);
            const attributes = attributify({
              app: req.params.app,
              model: json.id,
              json: scheme
            });
            postAttributes(req, {
              app: req.params.app,
              model: json.id,
              items: attributes,
            }).then(
              () => resolve()
            );
          });
      })
    );
    Promise.all(promises).then(() => res.json({}));
  });
};
