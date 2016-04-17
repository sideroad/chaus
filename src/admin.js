module.exports = {
  app: {
    name: {
      uniq: true,
      regexp: /^[0-9a-z]+$/
    },
    models: {
      children: 'model'
    }
  },
  model: {
    app: {
      uniq: true,
      parent: 'app.models'
    },
    name: {
      uniq: true,
      regexp: /^[0-9a-z]+$/
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
      regexp: /^[0-9a-z]+$/
    },
    uniq: {
      type: 'boolean'
    },
    required: {
      type: 'boolean'
    },
    type: {
      regexp: /^(string|number|date|boolean|parent|children|instance)$/
    },
    relation: {
      instance: 'model'
    },
    relationAttribute: {},
    regexp: {},
    invalid: {},
    desc: {}
  }
};
