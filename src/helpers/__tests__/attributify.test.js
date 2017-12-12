import attributify from '../attributify';

test('convert json to attributes', () => {
  expect(attributify({
    app: 'foo',
    model: 'foo-bar',
    json: {
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
      required: ['name', 'age'],
      uniqueKeys: ['name'],
    }
  })).toEqual([
    {
      app: 'foo',
      model: 'foo-bar',
      type: 'string',
      name: 'name',
      pattern: undefined,
      uniq: true,
      required: true,
    },
    {
      app: 'foo',
      model: 'foo-bar',
      type: 'number',
      name: 'age',
      pattern: undefined,
      required: true,
    }
  ]);
});
