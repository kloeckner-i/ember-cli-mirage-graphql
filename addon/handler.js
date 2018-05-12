import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import { createMocksForSchema } from './mock/create';
import { graphql } from 'graphql';

const createGraphQLHandler = (rawSchema, options) => ({ db }, request) => {
  let schema = makeExecutableSchema({ typeDefs: rawSchema });
  let { query, variables } = JSON.parse(request.requestBody);

  addMockFunctionsToSchema({
    schema,
    mocks: createMocksForSchema(schema, db, options),
    preserveResolvers: false
  });

  return graphql(schema, query, null, null, variables);
};

export default createGraphQLHandler;
