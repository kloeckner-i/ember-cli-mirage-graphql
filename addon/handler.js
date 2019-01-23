import {
  addMocksToSchema,
  addInterfaceTypeResolversToSchema,
  createSchema
} from './schema';
import { graphql } from 'graphql';

const createGraphQLHandler = (rawSchema, options) =>
  ({ db }, request) => {
    let { query, variables } = JSON.parse(request.requestBody);
    let schema = createSchema(rawSchema);

    addMocksToSchema(schema, db, options);
    addInterfaceTypeResolversToSchema(schema);

    return graphql(schema, query, null, null, variables);
  };

export default createGraphQLHandler;
