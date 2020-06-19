import MirageGraphQLAutoResolverStrategy from './mirage-graphql/auto-resolver-strategy';
import { GraphQLSchema, graphql } from 'graphql';
import { addResolvers } from './graphql-auto-resolve';
import { getCache, putCache } from './mirage-graphql/cache';
import { makeExecutableSchema } from 'graphql-tools';

function createGraphQLHandlerForSchema(graphQLSchema, context) {
  return function graphQLHandler(_mirageSchema, request) {
    try {
      const { query, variables } = JSON.parse(request.requestBody);

      return graphql(graphQLSchema, query, null, context, variables);
    } catch(ex) {
      // TODO: Return a Mirage error response here
      console.error(ex);
    }
  };
}

function getGraphQLSchemaWithResolvers({
  graphQLSchema,
  options,
  resolverStrategy
}) {
  if (!(graphQLSchema instanceof GraphQLSchema)) {
    graphQLSchema = makeExecutableSchema({ typeDefs: graphQLSchema });
  }

  const cacheKeys = { key: 'graphQLSchema', schema: graphQLSchema };

  return (
    getCache(cacheKeys) ||
    putCache({
      ...cacheKeys,
      value: addResolvers({ options, resolverStrategy, schema: graphQLSchema })
    })
  ).value;
}

export function createGraphQLHandler({
  graphQLSchema,
  mirageSchema,
  options = {}
}) {
  const context = options.context || {};
  const resolverStrategy = new MirageGraphQLAutoResolverStrategy(mirageSchema);
  const schemaWithResolvers = getGraphQLSchemaWithResolvers({
    graphQLSchema,
    options,
    resolverStrategy
  });

  context.resolverStrategy = resolverStrategy;

  return createGraphQLHandlerForSchema(schemaWithResolvers, context);
}
