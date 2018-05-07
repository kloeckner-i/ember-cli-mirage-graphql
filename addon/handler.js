import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import { createMocksForSchema } from './mock';
import { graphql } from 'graphql';

const createGraphQLHandler = (rawSchema, options = {}) => ({ db }, request) => {
  let schema = makeExecutableSchema({ typeDefs: rawSchema });
  let { fieldsMap, varsMap } = options;
  let { query, variables } = JSON.parse(request.requestBody);

  addMockFunctionsToSchema({
    schema,
    mocks: createMocksForSchema(schema, db, varsMap, fieldsMap),
    preserveResolvers: false
  });

  return graphql(schema, query, null, null, variables);
};

export default createGraphQLHandler;
