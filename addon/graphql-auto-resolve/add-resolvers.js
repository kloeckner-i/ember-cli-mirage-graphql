import { addResolversToSchema } from 'graphql-tools';
import {
  isPolymorphicType,
  isReslolveViaStrategyType,
  unwrapType
} from './type-utils';

function createPolymorphicTypeResolver(type, resolverStrategy) {
  const graphQLTypeName = type.constructor.name;

  return {
    __resolveType: (...args) =>
      resolverStrategy[`resolveTypeFor${graphQLTypeName}`](...args)
  };
}

function createResolver(type, resolverStrategy, fieldResolvers) {
  return isPolymorphicType(type)
    ? createPolymorphicTypeResolver(type, resolverStrategy)
    : createUniformTypeResolver(type, resolverStrategy, fieldResolvers);
}

function createResolvers(schema, resolverStrategy, optionalResolvers) {
  const typeMap = schema.getTypeMap();

  return Object.keys(typeMap).reduce(function(resolverMap, typeName) {
    const type = typeMap[typeName];

    if (shouldCreateResolver(type, typeName)) {
      const fieldResolvers = optionalResolvers[typeName];
      const resolver = createResolver(type, resolverStrategy, fieldResolvers);

      if (resolver) {
        resolverMap[typeName] = resolver;
      }

      resolverStrategy.resolverCreated(schema, type, resolver);
    }

    return resolverMap;
  }, {});
}

function createUniformTypeResolver(type, resolverStrategy, fieldResolvers) {
  const fields = type.getFields();

  return Object.keys(fields).reduce(function(resolver, fieldName) {
    const fieldResolver = fieldResolvers?.[fieldName];
    const { type: fieldType } = fields[fieldName];

    if (fieldResolver || shouldCreateResolver(fieldType, fieldName)) {
      const graphQLTypeName = fieldType.constructor.name;

      resolver = resolver || {};

      resolver[fieldName] = fieldResolver || function(...args) {
        return resolverStrategy[`resolve${graphQLTypeName}`](...args);
      };
    }

    return resolver;
  }, null);
}

function shouldCreateResolver(type, typeName) {
  const { type: unwrappedType } = unwrapType(type);

  return isReslolveViaStrategyType(unwrappedType) && !typeName.startsWith('__');
}

export function addResolvers({ options, resolverStrategy, schema }) {
  addResolversToSchema({
    resolvers: createResolvers(schema, resolverStrategy, options.resolvers),
    schema
  });

  return schema;
}
