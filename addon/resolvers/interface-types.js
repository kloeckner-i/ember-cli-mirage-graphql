import { contextSet, getFirstKey, reduceKeys } from '../utils';

function addInterfaceTypesToResolvers(type, resolvers = {}) {
  type._interfaces.forEach(({ name }) => {
    if (!(name in resolvers)) {
      resolvers[name] = { __resolveType: resolveInterfaceType };
    }
  });

  return resolvers;
}

const getFieldResolver = (fieldName) =>
  (data) =>
    data.__typename ? data[fieldName] : data[getFirstKey(data)][fieldName];

function resolveInterfaceType(data, _, { path, schema }) {
  let { key } = path;
  let typeName = schema.getType(data[key].__typename);

  return typeName;
}

const getInterfaceTypeResolverReducer = (typeMap) =>
  (resolvers, typeName) => {
    let type = typeMap[typeName];

    if (type._interfaces && type._interfaces.length) {
      resolvers = addInterfaceTypesToResolvers(type, resolvers);

      resolvers[type.name] = reduceKeys(type._fields, (fields, fieldName) =>
        contextSet(fields, fieldName, getFieldResolver(fieldName)), {});
    }

    return resolvers;
  };

export const createResolversForInterfaceTypes = ({ _typeMap }) =>
  reduceKeys(_typeMap, getInterfaceTypeResolverReducer(_typeMap), undefined);
