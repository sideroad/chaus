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
            const nodes = models.items.map(item => item.name);
            const edges = [];
            attributes.items.map(item => {

              if ( !item.model || !item.relation ) {
                return;
              }
              const model = __.find(models.items, { id: item.model.id });
              const relation = __.find(models.items, { id: item.relation.id});

              if ( !model || !relation ) {
                return;
              }
              const edge = model.name + ' -> ' + relation.name;
              switch (item.type) {
                case 'children':
                  if ( ! edges[edge] ) {
                    edges[edge] = [];
                  }
                  edges[edge].push('has-a');
                  break;
                case 'instance':
                  if ( ! edges[edge] ) {
                    edges[edge] = [];
                  }
                  edges[edge].push('ref');
                  break;
                default:
                  return;
              }
            });
            const networks = __.uniq(nodes).concat(Object.keys(edges).map(edge => edge + '[label="' + __.uniq( edges[edge] ).join(' / ') + '"]'));
            res.json({
              network: networks.join(';')
            });
          });
      });
  });
};