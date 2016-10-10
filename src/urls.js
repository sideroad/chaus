import config from './config';
const base = config.app.base;

export default {
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
};
