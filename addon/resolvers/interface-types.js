import { contextSet, getFirstKey, partial, reduceKeys } from '../utils';

export function addInterfaceTypesToResolvers(interfaces, resolvers = {}) {
  interfaces.forEach(({ name }) => {
    if (!(name in resolvers)) {
      resolvers[name] = { __resolveType: resolveInterfaceType };
    }
  });

  return resolvers;
}

export const resolveField = (fieldName, data) => data.__typename
  ? data[fieldName]
  : data[getFirstKey(data)][fieldName];

export function resolveInterfaceType(data, _, { path, schema }) {
  let { key } = path;
  let type = schema.getType(data[key].__typename);

  return type;
}

export const composeCreateResolverByFields = (resolveField) =>
  (fields) => reduceKeys(fields, (_fields, fieldName) =>
    contextSet(_fields, fieldName, partial(resolveField, fieldName)), {});

const createResolverByFields = composeCreateResolverByFields(resolveField);

export const composeCreateResolversForInterfaceTypes =
  (addInterfaceTypesToResolvers, createResolverByFields) =>
    ({ _typeMap }) => reduceKeys(_typeMap, (resolvers, typeName) => {
      let type = _typeMap[typeName];

      if (type._interfaces && type._interfaces.length) {
        resolvers = addInterfaceTypesToResolvers(type._interfaces, resolvers);

        resolvers[type.name] = createResolverByFields(type._fields);
      }

      return resolvers;
    });

export const createResolversForInterfaceTypes =
  composeCreateResolversForInterfaceTypes(addInterfaceTypesToResolvers,
    createResolverByFields);
