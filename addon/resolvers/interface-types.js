import { contextSet, getFirstKey, reduceKeys } from '../utils';

function addInterfaceTypesToResolvers(interfaces, resolvers = {}) {
  interfaces.forEach(({ name }) => {
    if (!(name in resolvers)) {
      resolvers[name] = { __resolveType: resolveInterfaceType };
    }
  });

  return resolvers;
}

const getFieldResolver = (fieldName) =>
  (data) => data.__typename
    ? data[fieldName]
    : data[getFirstKey(data)][fieldName];

const getInterfaceTypeResolverReducer = (typeMap) =>
  (resolvers, typeName) => {
    let type = typeMap[typeName];

    if (type._interfaces && type._interfaces.length) {
      resolvers = addInterfaceTypesToResolvers(type._interfaces, resolvers);

      resolvers[type.name] = reduceKeys(type._fields, (fields, fieldName) =>
        contextSet(fields, fieldName, getFieldResolver(fieldName)), {});
    }

    return resolvers;
  };

function resolveInterfaceType(data, _, { path, schema }) {
  let { key } = path;
  let type = schema.getType(data[key].__typename);

  return type;
}

export const createResolversForInterfaceTypes = ({ _typeMap }) =>
  reduceKeys(_typeMap, getInterfaceTypeResolverReducer(_typeMap));
