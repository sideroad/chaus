module.exports = {
  model: {
    name: {
      uniq: true,
      regexp: /^[0-9a-z]+$/
    },
    attributes: {
      children: 'attribute'
    }
  },
  attribute: {
    model: {
      uniq: true,
      parent: 'model.attributes'
    },
    name: {
      uniq: true,
      regexp: /^[0-9a-z]+$/
    },
    uniq: {
      regexp: /^(true|false)$/
    },
    required: {
      regexp: /^(true|false)$/
    },
    type: {
      regexp: /^(string|number|date|parent|children|instance)$/
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
