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

    addMockFunctionsToSchema({ schema, mocks, preserveResolvers: false });

    /*
      TODO

      * Dynamically generate the resolvers
     */
    addResolveFunctionsToSchema({
      resolvers: {
        Customer: {
          id: ({ customer }) => customer.id,
          name: ({ customer }) => customer.name,
          orders: ({ customer }) => customer.orders
        },
        Node: {
          __resolveType: (data, _, info) => {
            let type = info.schema.getType(data[info.path.key].__typename);

            return type;
          }
        }
      },
      schema
    });

    return graphql(schema, query, null, null, variables);
  };

export default createGraphQLHandler;
