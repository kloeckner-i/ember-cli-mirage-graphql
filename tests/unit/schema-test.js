import {
  composeAddInterfaceTypeResolversToSchema,
  composeAddMocksToSchema,
  composeCreateSchema
} from 'ember-cli-mirage-graphql/schema';
import { module, test } from 'qunit';

module('Unit | schema', function() {
  module('add interface type resolvers', function() {
    test('it adds resolvers for interface types', function(assert) {
      let resolvers = {};
      let schema = {};
      let createResolvers = () => resolvers;

      function addResolvers({ resolvers: _resolvers, schema: _schema }) {
        assert.equal(_resolvers, resolvers, 'It receives the resolvers');
        assert.equal(_schema, schema, 'It receives the schema');
      }

      let addInterfaceResolvers =
        composeAddInterfaceTypeResolversToSchema(createResolvers, addResolvers);

      addInterfaceResolvers(schema);
    });
  });

  module('add mocks', function() {
    test('it adss mocks to the schema', function(assert) {
      assert.expect(6);

      let db = {};
      let mocks = {};
      let options = {};
      let schema = {};

      function addMockFunctions(_options) {
        let { mocks: _mocks, preserveResolvers, schema: _schema } = _options;

        assert.equal(_mocks, mocks, 'It receives the mocks option');
        assert.notOk(preserveResolvers, 'It receives preserve resolvers option');
        assert.equal(_schema, schema, 'It receives the schema option');
      }

      function createMocks(_schema, _db, _options) {
        assert.equal(_schema, schema, 'It receives the schema');
        assert.equal(_db, db, 'It receives the db');
        assert.equal(_options, options, 'It receives the options');

        return mocks;
      }

      let addMocks = composeAddMocksToSchema(addMockFunctions, createMocks);

      addMocks(schema, db, options);
    });
  });

  module('create', function() {
    test('it creates a schema', function(assert) {
      let rawSchema = {};
      let schema = {};

      function makeSchema({ resolverValidationOptions, typeDefs }) {
        assert.notOk(resolverValidationOptions.requireResolversForResolveType,
          'It recieved the resolver validation options');
        assert.equal(typeDefs, rawSchema, 'It received the type defs');

        return schema;
      }

      let createSchema = composeCreateSchema(makeSchema);
      let newSchema = createSchema(rawSchema);

      assert.equal(newSchema, schema, 'It returns the new schema');
    });
  });
});
