import { composeCreateGraphQLHandler } from 'ember-cli-mirage-graphql/handler';
import { module, test } from 'qunit';

module('Unit | handler', function() {
  test('it parses the request, creates mocks and resolvers for schema and returns graphQL', function(assert) {
    assert.expect(8);

    let db = {};
    let options = {};
    let query = {};
    let rawSchema = {};
    let schema = {};
    let variables = {};
    let addResolvers = (_schema) =>
      assert.equal(_schema, schema, 'It received the schema');
    let parseRequest = () => ({ query, variables });

    function addMocks(_schema, _db, _options) {
      assert.equal(_schema, schema, 'It received the schema');
      assert.equal(_db, db, 'It received the db');
      assert.equal(_options, options, 'It received the options');
    }

    function createSchema(_rawSchema) {
      assert.equal(_rawSchema, rawSchema, 'It received the raw schema');
      return schema;
    }

    function graphQL(_schema, _query, _, __, vars) {
      assert.equal(_schema, schema, 'It received the schema');
      assert.equal(_query, query, 'It received the query');
      assert.equal(vars, variables, 'It received the vars');
    }

    let createHandler = composeCreateGraphQLHandler(parseRequest, createSchema,
      addMocks, addResolvers, graphQL);
    let handler = createHandler(rawSchema, options);

    handler({ db }, { request: {} });
  });
});
