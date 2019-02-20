import createMocksForSchema from './mocks/create';
import {
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
  makeExecutableSchema
} from 'graphql-tools';
import { createResolversForInterfaceTypes } from './resolvers/interface-types';

export const composeAddInterfaceTypeResolversToSchema =
  (createResolversForInterfaceTypes, addResolveFunctionsToSchema) =>
    (schema) => {
      let interfaceTypeResolvers = createResolversForInterfaceTypes(schema);

      if (interfaceTypeResolvers) {
        addResolveFunctionsToSchema({
          resolvers: interfaceTypeResolvers,
          schema
        });
      }
    };

export const addInterfaceTypeResolversToSchema =
  composeAddInterfaceTypeResolversToSchema(createResolversForInterfaceTypes,
    addResolveFunctionsToSchema);

export const composeAddMocksToSchema = (addMockFunctions, createMocks) =>
  (schema, db, options) =>
    addMockFunctions({
      mocks: createMocks(schema, db, options),
      preserveResolvers: false,
      schema
    });

export const addMocksToSchema =
  composeAddMocksToSchema(addMockFunctionsToSchema, createMocksForSchema);

export const composeCreateSchema = (makeExecutableSchema) =>
  (typeDefs) => makeExecutableSchema({
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    typeDefs
  });

export const createSchema = composeCreateSchema(makeExecutableSchema);
