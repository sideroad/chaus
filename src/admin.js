module.exports = {
  app: {
    name: {
      uniq: true,
      pattern: /^[0-9a-z]+$/
    },
    models: {
      children: 'model'
    },
    description: {
    },
    origins: {
      children: 'origin'
    }
  },
  origin: {
    app: {
      uniq: true,
      parent: 'app.origins'
    },
    url: {
      uniq: true
    }
  },
  model: {
    app: {
      uniq: true,
      parent: 'app.models'
    },
    name: {
      uniq: true,
      pattern: /^[0-9a-z]+$/
    },
    attributes: {
      children: 'attribute'
    }
  },
  attribute: {
    app: {
      uniq: true,
      parent: 'app.models'
    },
    model: {
      uniq: true,
      parent: 'model.attributes'
    },
    name: {
      uniq: true,
      pattern: /^[0-9a-z]+$/
    },
    uniq: {
      type: 'boolean'
    },
    required: {
      type: 'boolean'
    },
    type: {
      pattern: /^(string|number|date|boolean|parent|children|instance)$/
    },
    relation: {
      instance: 'model'
    },
    relationAttribute: {},
    pattern: {},
    invalid: {},
    desc: {}
  }
};
