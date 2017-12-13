import attributify from '../attributify';

test('convert json to attributes', () => {
  expect(attributify({
    app: 'foo',
    model: 'foo-bar',
    json: {
      properties: {
        name: {
          type: 'string',
          description: 'the name of foo-bar',
        },
        age: {
          type: 'integer',
        },
        hoge: {
          type: 'parent',
          rel: 'aaa.bbb'
        }
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
      desc: 'the name of foo-bar',
    },
    {
      app: 'foo',
      model: 'foo-bar',
      type: 'number',
      name: 'age',
      pattern: '^\\-?\\d+$',
      required: true,
      desc: undefined,
    },
    {
      app: 'foo',
      model: 'foo-bar',
      type: 'parent',
      name: 'hoge',
      pattern: undefined,
      relation: 'aaa',
      relationAttribute: 'bbb',
      desc: undefined,
    }
  ]);
});
