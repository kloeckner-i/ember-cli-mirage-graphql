import createMocksForSchema from './mocks/create';
import {
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
  makeExecutableSchema
} from 'graphql-tools';
import { createResolversForInterfaceTypes } from './resolvers/interface-types';

// TODO: Compose this function
export function addInterfaceTypeResolversToSchema(schema) {
  let interfaceTypeResolvers = createResolversForInterfaceTypes(schema);

  if (interfaceTypeResolvers) {
    addResolveFunctionsToSchema({
      resolvers: interfaceTypeResolvers,
      schema
    });
  }
}

// TODO: Compose this function
export const addMocksToSchema = (schema, db, options) =>
  addMockFunctionsToSchema({
    mocks: createMocksForSchema(schema, db, options),
    preserveResolvers: false,
    schema
  });

// TODO: Compose this function
export const createSchema = (typeDefs) => makeExecutableSchema({
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  typeDefs
});
