import { createMocksForSchema } from 'ember-cli-mirage-graphql/mocks/create';
import { module, test } from 'qunit';

module('Unit | Mocks | create', function() {
  test('it creates mocking functions for root schema types', function(assert) {
    let schema = {
      _mutationType: { name: 'Mutation', _fields: { foo: 'bar' } },
      _queryType: { name: 'Query', _fields: { foo: 'bar' } }
    };
    let mocks = createMocksForSchema(schema);
    let mutationMock = mocks.Mutation();
    let queryMock = mocks.Query();

    assert.equal(typeof mutationMock.foo, 'function', 'Mutation foo is mocked');
    assert.equal(typeof queryMock.foo, 'function', 'Query foo is mocked');
  });
});
