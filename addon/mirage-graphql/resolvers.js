import {
  RelayConnection,
  isRelayConnectionType,
  isRelayEdgeType
} from './relay-pagination';
import { cloneRecord } from './models';
import {
  defaultFieldResolver,
  defaultTypeResolver,
  isInterfaceType,
  isObjectType
} from 'graphql';
import { unwrapType } from '../graphql-auto-resolve/type-utils';

const RELAY_ARGS = ['after', 'before', 'first', 'last'];

function filterEdges(edges, relayArgs) {
  const { after, before, first, last } = relayArgs;
  const startIndex = after != null ? findIndexOfRelayEdge(edges, after) : 0;
  const endIndex = before != null ? findIndexOfRelayEdge(edges, before) : 0;

  if (first != null) edges = edges.slice(startIndex, startIndex + first);
  if (last != null) edges = edges.slice(endIndex, endIndex - last);

  return edges;
}

function findIndexOfRelayEdge(edges, cursor) {
  let index = 0;

  for (let i = 0; i < edges.length; i++) {
    if (edges[i].node.cursor === cursor) {
      index = i + 1; // TODO: This works for start cursor, does it work for end?
      break;
    }
  }

  return index;
}

function getArgsForCollection(args, type) {
  const fields = type.getFields();

  return Object.keys(args).reduce(function(argsForCollection, arg) {
    if (args[arg] != null && arg in fields) {
      argsForCollection[arg] = args[arg];
    }

    return argsForCollection;
  }, {});
}

function getRelayArgs(args) {
  return Object.keys(args).reduce(function(separatedArgs, arg) {
    const argsSet = RELAY_ARGS.includes(arg) ? 'relayArgs' : 'nonRelayArgs';

    separatedArgs[argsSet][arg] = args[arg];

    return separatedArgs;
  }, { relayArgs: {}, nonRelayArgs: {} });
}

function getUserResolver(info, resolvers) {
  const { fieldName, parentType } = info;

  return resolvers[parentType.name]?.[fieldName];
}

function resolveList(obj, args, context, info, type) {
  if (isRelayEdgeType(type)) {
    return resolveRelayEdges(obj, info);
  }

  if (obj) {
    return obj[info.fieldName].models;
  }

  const collectionArgs = getArgsForCollection(args, type);
  const collectionName = context.mirageSchema.toCollectionName(type.name);

  return context.mirageSchema[collectionName].where(collectionArgs).models;
}

function resolveObject(obj, args, context, info, type) {
  if (isRelayConnectionType(type)) {
    return resolveRelayConnection(obj, args, info);
  }

  if (obj) {
    return obj[info.fieldName];
  }

  const collectionName = context.mirageSchema.toCollectionName(type.name);
  let record = context.mirageSchema[collectionName].findBy(args);

  if (record) {
    record = cloneRecord(record, info);
    record.__typename = type.name;
  }

  return record;
}

function resolveRelayConnection(obj, args, info) {
  const options = { args, type: info.returnType };
  const records = obj && obj[info.fieldName]?.models;

  if (records) {
    options.records = records;
  }

  return new RelayConnection(options);
}

function resolveRelayEdges(connection, info) {
  const { relayArgs, nonRelayArgs } = getRelayArgs(connection.args);
  const records = connection.records ||
    this._getRecordsForType(info.returnType.ofType, nonRelayArgs);
  const filteredRecords = filterEdges(records, relayArgs);

  connection.setRecords(filteredRecords).setEdges().setPageInfo();

  return connection.edges;
}

function unwrapInterfaceType(info) {
  const selection = info.fieldNodes[0].selectionSet.selections.find(
    ({ kind }) => kind === 'InlineFragment'
  );
  
  if (selection) {
    const { typeCondition: { name: { value: typeName } } } = selection;
    
    return info.schema.getTypeMap()[typeName];
  }
}

export function createFieldResolver(resolvers) {
  /**
   * TODO:
   *   - Test delegating to user resolvers
   *   - Do some generic type unwrapping
   *   - Delegate to different types of resolvers
   *   - Determine how to deal with resolving fields on the parent
   * 
   *   What is the resolver algorithm?
   *     unwrap type
   *     if user resolver
   *       resolve via user resolver
   * 
   *     if object type
   *       if list type
   *         resolve list type (maybe relay edge, maybe union)
   *       else
   *         resolve object type (maybe relay connection)
   *     
   *     if interface type
   *       resolve interface type
   * 
   *     default resolver
   */
  return function fieldResolver(obj, args, context, info) {
    let { isList, type } = unwrapType(info.returnType);
    const userResolver = getUserResolver(info, resolvers);

    if (userResolver) {
      return userResolver(...arguments);
    }

    if (isInterfaceType(type)) {
      type = unwrapInterfaceType(info);
    }

    if (isObjectType(type)) {
      if (isList) {
        return resolveList(obj, args, context, info, type);
      }

      return resolveObject(obj, args, context, info, type);
    }

    return defaultFieldResolver(...arguments);
  };
}

export function createTypeResolver(resolvers) {
  return function typeResolver(_obj, _context, info) {
    const userResolver = getUserResolver(info, resolvers);

    if (userResolver) {
      return userResolver(...arguments);
    }

    return defaultTypeResolver(...arguments);
  };
}
