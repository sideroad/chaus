import _ from 'lodash';

export default function attributify({ app, model, json }) {
  const properties = json.properties;
  const attributes = Object.keys(properties).map((property) => {
    const val = properties[property];
    if (
      val.type !== 'string' &&
      val.type !== 'boolean' &&
      val.type !== 'date' &&
      val.type !== 'number' &&
      val.type !== 'parent' &&
      val.type !== 'children' &&
      val.type !== 'instance' &&
      val.type !== 'integer'
    ) {
      return undefined;
    }
    return {
      app,
      model,
      name: property,
      type: val.type === 'integer' ? 'number' : val.type,
      pattern: val.pattern || val.type === 'integer' ? '^\\-?\\d+$' : undefined,
      relation: val.rel ? val.rel.split('.')[0] : undefined,
      relationAttribute: val.rel ? val.rel.split('.')[1] : undefined,
    };
  }).filter(val => val);

  (json.required || []).forEach((property) => {
    const target = _.find(attributes, { name: property });
    if (target) {
      target.required = true;
    }
  });
  (json.uniqueKeys || []).forEach((property) => {
    const target = _.find(attributes, { name: property });
    if (target) {
      target.uniq = true;
    }
  });
  return attributes;
}
