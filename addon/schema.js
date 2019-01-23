import {
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
  makeExecutableSchema
} from 'graphql-tools';
import { createMocksForSchema } from './mocks/create';
import { createResolversForInterfaceTypes } from './resolvers/interface-types';

export function addInterfaceTypeResolversToSchema(schema) {
  let interfaceTypeResolvers = createResolversForInterfaceTypes(schema);

  if (interfaceTypeResolvers) {
    addResolveFunctionsToSchema({
      resolvers: interfaceTypeResolvers,
      schema
    });
  }
}

export const addMocksToSchema = (schema, db, options) =>
  addMockFunctionsToSchema({
    mocks: createMocksForSchema(schema, db, options),
    preserveResolvers: false,
    schema
  });

export const createSchema = (typeDefs) => makeExecutableSchema({
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  typeDefs
});
