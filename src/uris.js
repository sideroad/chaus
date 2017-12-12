
export default {
  admin: {
    root: '/admin/api',
    apps: '/admin/api/apps',
    app: '/admin/api/apps/:app',
    origins: '/admin/api/origins',
    models: '/admin/api/models',
    attributes: '/admin/api/attributes',
    restart: '/admin/restart',
    network: '/admin/networks/:app',
    jsonLoader: '/admin/json-loader/:app'
  },
  pages: {
    root: '/:lang',
    apps: '/:lang/apps',
    models: '/:lang/apps/:app/resources',
    model: '/:lang/apps/:app/resources/:name',
    data: '/:lang/apps/:app/data',
    records: '/:lang/apps/:app/data/:name',
    configs: '/:lang/apps/:app/configs',
    offline: '/:lang/offline',
    docs: '/docs/:app',
  },
  apis: {
    root: '/apis/:app',
    collection: '/apis/:app/:model',
    instance: '/apis/:app/:model/:id',
  }
};
