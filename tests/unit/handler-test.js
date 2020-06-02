import { composeCreateGraphQLHandler } from 'ember-cli-mirage-graphql/handler';
import gql from 'graphql-tag';
import { mergeSchemas } from 'graphql-tools';
import { module, test } from 'qunit';

module('Unit | handler', function() {
  const db = {};
  const options = {};
  const query = {};
  const variables = {};

  const composeAddResolvers = (schema, assert) => (_schema) =>
    assert.equal(_schema, schema, 'It received the schema');
  
  const parseRequest = () => ({ query, variables });

  const composeAddMocks = (schema, assert) => (_schema, _db, _options) => {
    assert.equal(_schema, schema, 'It received the schema');
    assert.equal(_db, db, 'It received the db');
    assert.equal(_options, options, 'It received the options');
  };

  const composeGraphQL = (schema, assert) => (_schema, _query, _, __, vars) => {
    assert.equal(_schema, schema, 'It received the schema');
    assert.equal(_query, query, 'It received the query');
    assert.equal(vars, variables, 'It received the vars');
  }
  
  const composeAdditionalCallbacks = (schema, assert) => [
    composeAddMocks(schema, assert),
    composeAddResolvers(schema, assert),
    composeGraphQL(schema, assert)
  ];

  const composeCreateHandler = (createSchema, schema, assert) =>
    composeCreateGraphQLHandler(
      parseRequest,
      createSchema,
      ...composeAdditionalCallbacks(schema, assert));

  module('raw schema', function() {
    test('it parses the request, creates mocks and resolvers for schema and returns GraphQL', function(assert) {
      assert.expect(8);

      const schema = {};

      function createSchema(_schema) {
        assert.equal(_schema, schema, 'It received the raw schema');
        return schema;
      }

      const createHandler = composeCreateHandler(createSchema, schema, assert);
      const handler = createHandler(schema, options);

      handler({ db }, { request: {} });
    });
  });

  module('merged schema', function() {
    test('it parses the request, creates mocks and resolvers for schema and returns GraphQL', function(assert) {
      assert.expect(7);
      
      const fooSchema = gql`
        type Foo {
          name: String
        }

        type Query {
          foos: [Foo]
        }
      `;
      const barSchema = gql`
        type Bar {
          name: String
        }

        type Query {
          bars: [Bar]
        }
      `;
      const createSchema = () => assert.equal(0, 1); // This should not be called
      const schema = mergeSchemas({ schemas: [fooSchema, barSchema] });
      const createHandler = composeCreateHandler(createSchema, schema, assert);
      const handler = createHandler(schema, options);
      
      handler({ db }, { request: {} });
    });
  })
});
