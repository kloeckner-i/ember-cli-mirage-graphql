import { createResolversForInterfaceTypes } from
  'ember-cli-mirage-graphql/resolvers/interface-types';
import { module, test } from 'qunit';

module('Unit | Resolvers | interface-types', function() {
  test('it creates resolvers for interface types', function(assert) {
    assert.expect(2);

    let bazData = { baz: 1 };
    let data = { key: { __typename: 'Foo' } };
    let path = { key: 'key' };
    let schema = {
      getType(typeName) {
        assert.equal(typeName, 'Foo', 'It looks up the type in the schema');
      },
      _typeMap: {
        Foo: {
          name: 'Foo',
          _fields: { baz: null },
          _interfaces: [{ name: 'Bar' }]
        }
      }
    };
    let resolvers = createResolversForInterfaceTypes(schema);

    resolvers.Bar.__resolveType(data, null, { path, schema });

    let resolvedBaz = resolvers.Foo.baz({ _: bazData });

    assert.equal(resolvedBaz, bazData.baz, 'It resolves fields');
  });
});
