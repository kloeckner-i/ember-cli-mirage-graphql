import {
  addMocksToSchema,
  addInterfaceTypeResolversToSchema,
  createSchema
} from './schema';
import { graphql } from 'graphql';

export const composeCreateGraphQLHandler =
  (parseRequest, createSchema, addMocksToSchema, addInterfaceTypeResolversToSchema, graphql) =>
    (rawSchema, options) =>
      ({ db }, request) => {
        let { query, variables } = parseRequest(request.requestBody);
        let schema = createSchema(rawSchema);

        addMocksToSchema(schema, db, options);
        addInterfaceTypeResolversToSchema(schema);

        return graphql(schema, query, null, null, variables);
      };

const createGraphQLHandler = composeCreateGraphQLHandler(JSON.parse,
  createSchema, addMocksToSchema, addInterfaceTypeResolversToSchema, graphql);

export default createGraphQLHandler;
