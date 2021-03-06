module.exports = {
  app: {
    name: {
      uniq: true,
      pattern: /^[0-9a-z-]+$/,
      invalid: 'Only Numeric, Alphabet lowercase and hyphen character can be used'
    },
    models: {
      children: 'model'
    },
    description: {
    },
    origins: {
      children: 'origin'
    },
    allows: {
      children: 'allow'
    },
    caller: {
      pattern: /^(client|server)$/
    },
    client: {
      pattern: /^[0-9a-f-]+$/
    },
    secret: {
    }
  },
  allow: {
    user: {
      uniq: true
    },
    app: {
      uniq: true,
      parent: 'app.allows'
    }
  },
  origin: {
    app: {
      uniq: true,
      parent: 'app.origins'
    },
    url: {
      uniq: true,
      invalid: 'Empty URL is not allowed, Specify Allowed origin or *'
    }
  },
  model: {
    app: {
      uniq: true,
      type: 'parent',
      relation: 'app.models'
    },
    name: {
      uniq: true,
      pattern: /^[0-9a-z-]+$/,
      invalid: 'Only Numeric, Alphabet lowercase and hyphen character can be used'
    },
    attributes: {
      type: 'children',
      relation: 'attribute'
    }
  },
  attribute: {
    app: {
      uniq: true
    },
    model: {
      uniq: true,
      type: 'parent',
      relation: 'model.attributes'
    },
    name: {
      uniq: true,
      pattern: /^[0-9a-zA-Z-]+$/,
      invalid: 'Only Numeric, Alphabet and hyphen character can be used'
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
      type: 'instance',
      relation: 'model'
    },
    relationAttribute: {},
    pattern: {},
    invalid: {},
    desc: {}
  }
};
