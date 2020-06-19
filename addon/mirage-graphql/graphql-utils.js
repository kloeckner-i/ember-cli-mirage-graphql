import { getCache, putCache } from './cache';
import { isListType, isNonNullType, isObjectType } from 'graphql';
import { isRelayType } from './relay-pagination';

function getBuiltInGraphQLSchemaObjectTypes(graphQLSchema) {
  const cacheKeys = {
    key: 'builtInGraphQLSchemaObjectTypes',
    schema: graphQLSchema
  };

  return (getCache(cacheKeys) ||
    putCache({
      ...cacheKeys,
      value: [
        graphQLSchema.getMutationType(),
        graphQLSchema.getQueryType(),
        graphQLSchema.getSubscriptionType()
      ]
    })
  ).value;
}

// Test: it returns true if object type not root query, mutation or subscription
// Test: it returns false if root query, mutation or subscription type
export function isNotBuiltInGraphQLSchemaObjectType(graphQLSchema, type) {
  return isObjectType(type) &&
    !(getBuiltInGraphQLSchemaObjectTypes(graphQLSchema).find(
      (builtInObjectType) => type === builtInObjectType
    ));
}

export function unwrapTypeForModel(type, meta = { isList: false }) {
  if (type.name && isRelayType(type)) {
    const fields = type.getFields();

    return fields.edges
      ? unwrapTypeForModel(fields.edges.type, meta)
      : unwrapTypeForModel(fields.node.type, meta);
  }

  const isList = isListType(type);

  if (isList || isNonNullType(type)) {
    if (!meta.isList) {
      meta.isList = isList;
    }
  
    return unwrapTypeForModel(type.ofType, meta);
  }
  
  return { ...meta, type };
}
