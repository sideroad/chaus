import _ from 'lodash';

export default function attributify({ app, model, json }) {
  const properties = json.properties;
  const attributes = Object.keys(properties).map((property) => {
    const val = properties[property];
    if (
      val.type === 'array' ||
      val.type === 'object'
    ) {
      return undefined;
    }
    return {
      app,
      model,
      name: property,
      type: val.type,
      pattern: val.pattern
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
