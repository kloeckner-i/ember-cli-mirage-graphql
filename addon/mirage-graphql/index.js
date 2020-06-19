import { GraphQLSchema, graphql } from 'graphql';
import { Response } from 'ember-cli-mirage';
import { createFieldResolver, createTypeResolver } from './resolvers';
import { ensureModels } from './models';
import { makeExecutableSchema } from 'graphql-tools';

// TODO: Why were we caching the GraphQL schema before...?

function setupHandler({ context, graphQLSchema, mirageSchema, resolvers }) {
  const fieldResolver = createFieldResolver(resolvers);
  const typeResolver = createTypeResolver(resolvers);

  if (!(graphQLSchema instanceof GraphQLSchema)) {
    graphQLSchema = makeExecutableSchema({ typeDefs: graphQLSchema });
  }

  context.mirageSchema = mirageSchema;

  ensureModels({ graphQLSchema, mirageSchema });

  return { fieldResolver, schema: graphQLSchema, typeResolver };
}

/**
 * TODO: Document this well.
 * 
 * @param {Object} options 
 */
export function createGraphQLHandler({
  context = {},
  graphQLSchema,
  mirageSchema,
  resolvers = {},
  root
}) {
  const { fieldResolver, schema, typeResolver } = setupHandler({
    context,
    graphQLSchema,
    mirageSchema,
    resolvers
  });

  return function graphQLHandler(_mirageSchema, request) {
    try {
      const { query, variables } = JSON.parse(request.requestBody);

      return graphql({
        contextValue: context,
        fieldResolver,
        rootValue: root,
        schema,
        source: query,
        typeResolver,
        variableValues: variables
      });
    } catch(ex) {
      return new Response(500, { errors: [ex] });
    }
  };
}
