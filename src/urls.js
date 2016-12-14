import config from './config';
const base = config.global.base;

export default {
  apps: {
    load: {
      url: base + '/admin/api/apps',
      method: 'GET',
      defaults: {
        limit: 1000
      },
      credentials: 'include'
    },
    save: {
      url: base + '/admin/api/apps',
      method: 'POST',
      credentials: 'include'
    },
    delete: {
      url: base + '/admin/api/apps/:app',
      method: 'DELETE',
      credentials: 'include'
    }
  },
  page: {
    restart: {
      url: base + '/admin/restart',
      method: 'GET',
      credentials: 'include'
    }
  },
  models: {
    load: {
      url: base + '/admin/api/models',
      method: 'GET',
      defaults: {
        limit: 10000
      },
      credentials: 'include'
    },
    save: {
      url: base + '/admin/api/models',
      method: 'POST',
      credentials: 'include'
    },
    delete: {
      url: base + '/admin/api/models/:model',
      method: 'DELETE',
      credentials: 'include'
    },
    deletes: {
      url: base + '/admin/api/models',
      method: 'DELETE',
      credentials: 'include'
    }
  },
  networks: {
    load: {
      url: base + '/admin/networks/:app',
      method: 'GET',
      credentials: 'include'
    }
  },
  attributes: {
    load: {
      url: base + '/admin/api/attributes',
      method: 'GET',
      defaults: {
        limit: 100000
      },
      credentials: 'include'
    },
    save: {
      url: base + '/admin/api/attributes',
      method: 'POST',
      credentials: 'include'
    },
    deletes: {
      url: base + '/admin/api/attributes',
      method: 'DELETE',
      credentials: 'include'
    }
  },
  records: {
    load: {
      url: base + '/apis/:app/:model',
      method: 'GET',
      defaults: {
        limit: 10000
      },
      credentials: 'include'
    },
    delete: {
      url: base + '/apis/:app/:model/:id',
      method: 'DELETE',
      credentials: 'include'
    },
    deletes: {
      url: base + '/apis/:app/:model',
      method: 'DELETE',
      credentials: 'include'
    },
    create: {
      url: base + '/apis/:app/:model',
      method: 'POST',
      credentials: 'include'
    },
    update: {
      url: base + '/apis/:app/:model/:id',
      method: 'POST',
      credentials: 'include'
    }
  },
  configs: {
    load: {
      url: base + '/admin/api/apps/:app',
      method: 'GET',
      credentials: 'include'
    },
    save: {
      url: base + '/admin/api/apps/:app',
      method: 'POST',
      credentials: 'include'
    }
  },
  origins: {
    load: {
      url: base + '/admin/api/origins',
      method: 'GET',
      defaults: {
        limit: 1000
      },
      credentials: 'include'
    },
    save: {
      url: base + '/admin/api/origins',
      method: 'POST',
      credentials: 'include'
    },
    deletes: {
      url: base + '/admin/api/origins',
      method: 'DELETE',
      credentials: 'include'
    }
  }
};
