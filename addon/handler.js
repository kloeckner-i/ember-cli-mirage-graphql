import {
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
  makeExecutableSchema
} from 'graphql-tools';
import { createMocksForSchema } from './mocks/create';
import { graphql } from 'graphql';

const createGraphQLHandler = (rawSchema, options) =>
  ({ db }, request) => {
    let schema = makeExecutableSchema({
      resolverValidationOptions: {
        requireResolversForResolveType: false
      },
      typeDefs: rawSchema
    });
    let { query, variables } = JSON.parse(request.requestBody);
    let mocks = createMocksForSchema(schema, db, options);

    addResolveFunctionsToSchema(schema, {
      Node: {
        __resolveType: (data, _, info) =>
          info.schema.getType(data[info.path.key].__typename)
      }
    });
    addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

    return graphql(schema, query, null, null, variables);
  };

export default createGraphQLHandler;
