
export default {
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
  pages: {
    root: '/:lang/apps',
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
  }
};
