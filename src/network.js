import {} from 'isomorphic-fetch';
import uris from './uris';
import config from './config';
import __ from 'lodash';

function fetchAttributes(app) {
  console.log('Loading attributes...');
  return fetch( 'http://' + config.host + ':' + config.port + uris.admin.attributes + '?app=' + encodeURIComponent(app) + '&limit=10000', {
    method: 'GET'
  }).then(res => res.json())
    .catch(err => console.error(err));
}

function fetchModels(app) {
  console.log('Loading models...');
  return fetch( 'http://' + config.host + ':' + config.port + uris.admin.models + '?app=' + encodeURIComponent(app) + '&limit=10000', {
    method: 'GET'
  }).then(res => res.json())
    .catch(err => console.error(err));
}

export default app => {
  app.get(uris.admin.network, (req, res) => {
    fetchModels(req.params.app)
      .then(models => {
        fetchAttributes(req.params.app)
          .then(attributes => {
            const networks = [];
            models.items.map(item => networks.push(item.name));
            attributes.items.map(item => {
              switch (item.type) {
                case 'children':
                  networks.push(
                    __.find(models.items, { id: item.model.id }).name +
                    ' -> ' +
                    __.find(models.items, { id: item.relation.id}).name +
                    ' [label=children]');
                  break;
                case 'instance':
                  networks.push(
                    __.find(models.items, { id: item.model.id }).name +
                    ' -> ' +
                    __.find(models.items, { id: item.relation.id}).name +
                    ' [label=instance]');
                  break;
                default:
                  return;
              }
            });
            res.json({
              network: __.uniq(networks).join(';')
            });
          });
      });
  });
};
