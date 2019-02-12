import { composeCreateMocksForSchema, reduceMocks } from
  'ember-cli-mirage-graphql/mocks/create';
import { module, test } from 'qunit';

module('Unit | Mocks | create', function() {
  module('mocks for schema', function() {
    test('it creates mocks for query and mutation types', function(assert) {
      assert.expect(3);

      let db = {};
      let options = {};
      let schema = { _mutationType: {}, _queryType: {} };
      let createMocks = (typesAndMockFns, _db, _options) => {
        assert.deepEqual(typesAndMockFns, [
          [schema._queryType, null],
          [schema._mutationType, null]
        ], 'It received the query and mutation types to mock');
        assert.equal(_db, db, 'It received the db');
        assert.equal(_options, options, 'It received the options');
      };
      let createMocksForSchema =
        composeCreateMocksForSchema(createMocks, null, null);

      createMocksForSchema(schema, db, options);
    });
  });

  module('reduce mocks', function() {
    test('it creates mock functions for fields', function(assert) {
      let db = {};
      let options = {};
      let type = { _fields: {}, name: 'Foo' };
      let mockType = (fields, _mockFn, _db, _options) => {
        assert.equal(fields, type._fields, 'It received the fields');
        assert.equal(_mockFn, mockType, 'It received the mock function');
        assert.equal(_db, db, 'It received the db');
        assert.equal(_options, options, 'It received the options');
      };
      let mocks = reduceMocks(mockType, db, options, {}, [type, mockType]);

      mocks[type.name]()
    });
  });
});
