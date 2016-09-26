import config from './config';
const base = ( config.global.port === 443 ? 'https' : 'http' ) +
             '://' +
             config.global.host +
             ( config.global.port === 80 || config.global.port === 443
               ? ''
               : ':' + config.global.port);

const uris = {
  base,
  admin: {
    root: '/admin/api',
    apps: '/admin/api/apps',
    app: '/admin/api/apps/:app',
    origins: '/admin/api/origins',
    models: '/admin/api/models',
    attributes: '/admin/api/attributes',
    restart: '/admin/restart',
    network: '/admin/networks/:app'
  },
  resources: {
    apps: {
      load: {
        url: base + '/admin/api/apps',
        method: 'GET',
        defaults: {
          limit: 1000
        }
      },
      save: {
        url: base + '/admin/api/apps',
        method: 'POST'
      },
      delete: {
        url: base + '/admin/api/apps/:app',
        method: 'DELETE'
      }
    },
    page: {
      restart: {
        url: base + '/admin/restart',
        method: 'GET'
      }
    },
    models: {
      load: {
        url: base + '/admin/api/models',
        method: 'GET',
        defaults: {
          limit: 10000
        }
      },
      save: {
        url: base + '/admin/api/models',
        method: 'POST'
      },
      delete: {
        url: base + '/admin/api/models/:model',
        method: 'DELETE'
      },
      deletes: {
        url: base + '/admin/api/models',
        method: 'DELETE'
      }
    },
    networks: {
      load: {
        url: base + '/admin/networks/:app',
        method: 'GET'
      }
    },
    attributes: {
      load: {
        url: base + '/admin/api/attributes',
        method: 'GET',
        defaults: {
          limit: 100000
        }
      },
      save: {
        url: base + '/admin/api/attributes',
        method: 'POST'
      },
      deletes: {
        url: base + '/admin/api/attributes',
        method: 'DELETE'
      }
    },
    records: {
      load: {
        url: base + '/apis/:app/:model',
        method: 'GET',
        defaults: {
          limit: 10000
        }
      },
      delete: {
        url: base + '/apis/:app/:model/:id',
        method: 'DELETE'
      },
      deletes: {
        url: base + '/apis/:app/:model',
        method: 'DELETE'
      },
      create: {
        url: base + '/apis/:app/:model',
        method: 'POST'
      },
      update: {
        url: base + '/apis/:app/:model/:id',
        method: 'POST'
      }
    },
    configs: {
      load: {
        url: base + '/admin/api/apps/:app',
        method: 'GET'
      },
      save: {
        url: base + '/admin/api/apps/:app',
        method: 'POST'
      }
    },
    origins: {
      load: {
        url: base + '/admin/api/origins',
        method: 'GET',
        defaults: {
          limit: 1000
        }
      },
      save: {
        url: base + '/admin/api/origins',
        method: 'POST'
      },
      deletes: {
        url: base + '/admin/api/origins',
        method: 'DELETE'
      }
    }
  },
  apps: {
    defaults: '/en/apps',
    apps: '/:lang/apps',
    models: '/:lang/apps/:app/models',
    model: '/:lang/apps/:app/models/:name',
    data: '/:lang/apps/:app/data',
    records: '/:lang/apps/:app/data/:name',
    configs: '/:lang/apps/:app/configs',
    docs: '/docs/:app'
  },
  apis: {
    root: '/apis/:app',
    collection: '/apis/:app/:model',
    instance: '/apis/:app/:model/:id',
  },

  // normalized functions
  normalize: (_uri, params) => {
    let uri = _uri;
    Object.keys(params).forEach(key =>
      uri = uri.replace(':' + key, encodeURIComponent(params[key]))
    );
    if (/\:/.test(uri) ) {
      throw new Error('Required params are remained [' + uri + ']');
    }
    return uri;
  }
};

export default uris;
