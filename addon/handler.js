import {
  addMocksToSchema,
  addInterfaceTypeResolversToSchema,
  createSchema
} from './schema';
import { deprecate } from '@ember/debug';
import { graphql } from 'graphql';

export const composeCreateGraphQLHandler =
  (parseRequest, createSchema, addMocksToSchema, addInterfaceTypeResolversToSchema, graphql) =>
    (rawSchema, options) =>
      ({ db }, request) => {
        let { query, variables } = parseRequest(request.requestBody);
        let schema = createSchema(rawSchema);

        if (options.varsMap) {
          deprecate('ember-cli-mirage-graphql varsMap is deprecated, please use argsMap instead', false, {
            id: 'ember-cli-mirage-graphql.vars-map',
            until: '1.0.0',
            url: 'https://github.com/kloeckner-i/ember-cli-mirage-graphql/blob/master/DEPRECATIONS.md'
          });

          if (!options.argsMap) {
            options.argsMap = options.varsMap;
          }

          delete options.varsMap;
        }

        addMocksToSchema(schema, db, options);
        addInterfaceTypeResolversToSchema(schema);

        return graphql(schema, query, null, null, variables);
      };

const createGraphQLHandler = composeCreateGraphQLHandler(JSON.parse,
  createSchema, addMocksToSchema, addInterfaceTypeResolversToSchema, graphql);

export default createGraphQLHandler;
