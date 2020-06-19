import { BaseGraphQLAutoResolveStrategy } from '../graphql-auto-resolve';
import { RelayConnection } from './relay-pagination';
import { addModelToMirageSchema } from './models';
import { isRelayConnectionType, isRelayEdgeType } from './relay-pagination';
import { unwrapType } from '../graphql-auto-resolve/type-utils';
import { isUnionType } from 'graphql';

const RELAY_ARGS = ['after', 'before', 'first', 'last'];

/**
 * TODO:
 *   - Figure out how to resolve polymorphic types
 *     - For interface types, we can look to inline fragments but is this
 *       reliable?
 *     - For union types...?
 */

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

// TODO: Should we abstract this?
function unwrapInterfaceType(info) {
  const selection = info.fieldNodes[0].selectionSet.selections.find(
    ({ kind }) => kind === 'InlineFragment'
  );
  
  if (selection) {
    const { typeCondition: { name: { value: typeName } } } = selection;
    
    return info.schema.getTypeMap()[typeName];
  }
}

export default class MirageGraphQLAutoResolverStrategy
  extends BaseGraphQLAutoResolveStrategy
{
  constructor(mirageSchema, options) {
    super(options);

    this.mirageSchema = mirageSchema;
  }

  resolveGraphQLInterfaceType(obj, args, context, info) {
    // TODO: Does this make sense for interface types?
    if (obj) {
      return obj[info.fieldName];
    }

    return this.resolveGraphQLObjectType(obj, args, context, {
      returnType: unwrapInterfaceType(info) 
    });
  }

  /**
   * TODO:
   *   - Can this resolve a list of non-null types? Doesn't look like it.
   *   - What about union types?
   */
  resolveGraphQLList(obj, args, _context, info) {
    if (isRelayEdgeType(info.returnType.ofType)) {
      return this.resolveRelayEdges(obj, info);
    }

    if (obj) {
      return obj[info.fieldName].models;
    }

    return this._getRecordsForType(info.returnType.ofType, args);
  }

  resolveGraphQLNonNull(obj, args, context, info) {
    const { isList, type } = unwrapType(info.returnType);

    if (isRelayConnectionType(type)) {
      return this.resolveRelayConnection(obj, args, info);
    }
    
    if (isRelayEdgeType(type)) {
      return this.resolveRelayEdges(obj, info);
    }
    
    if (obj) {
      return obj[info.fieldName];
    }

    const resolverType = isList ? 'GraphQLList' : type.constructor.name;

    return this[`resolve${resolverType}`](obj, args, context, {
      fieldName: info.fieldName,
      returnType: isList ? { ofType: type } : type
    });
  }

  resolveGraphQLObjectType(obj, args, _context, info) {
    if (isRelayConnectionType(info.returnType)) {
      return this.resolveRelayConnection(obj, args, info);
    }

    if (obj) {
      return obj[info.fieldName];
    }

    const collectionName =
      this.mirageSchema.toCollectionName(info.returnType.name);

    return this.mirageSchema[collectionName].findBy(args);
  }

  resolveGraphQLUnionType(obj, args, _context, info) {
    debugger;
    if (obj) {
      return obj[info.fieldName];
    }
  }

  resolveRelayConnection(obj, args, info) {
    const options = { args, type: info.returnType };
    const records = obj && obj[info.fieldName]?.models;

    if (records) {
      options.records = records;
    }

    return new RelayConnection(options);
  }

  /**
   * TODO:
   *   - As written, this function isn't helpful if a developer wants to
   *     compose their own list type resolver for edges. This is due to the
   *     reliance upon the connection being passed in. Question is: Is there any
   *     other way to do this?
   */
  resolveRelayEdges(connection, info) {
    const { relayArgs, nonRelayArgs } = getRelayArgs(connection.args);
    const records = connection.records ||
      this._getRecordsForType(info.returnType.ofType, nonRelayArgs);
    const filteredRecords = filterEdges(records, relayArgs);

    connection.setRecords(filteredRecords).setEdges().setPageInfo();

    return connection.edges;
  }

  // TODO: Why do we need this?
  resolveTypeForGraphQLInterfaceType(_obj, _context, info) {
    const inlineFragment = info.fieldNodes[0].selectionSet.selections.find(
      ({ kind }) => kind === 'InlineFragment'
    );

    return inlineFragment.typeCondition.name.value;
  }

  /**
   * TODO: How do we resolve a union type?
   *   - Get the Mirage models for each possible type, look for a unique field
   *     and then 
   */
  resolveTypeForGraphQLUnionType(_obj, _context, info) {
    debugger;
  }

  // Test: it calls addModelToMirageSchema with Mirage schema, GraphQL schema and type
  resolverCreated(graphQLSchema, type) {
    addModelToMirageSchema(this.mirageSchema, graphQLSchema, type);
  }

  _getRecordsForType(type, args) {
    const { type: unwrappedType } = unwrapType(type);
    const collectionArgs = getArgsForCollection(args, unwrappedType);
    const collectionName =
      this.mirageSchema.toCollectionName(unwrappedType.name);

    return this.mirageSchema[collectionName].where(collectionArgs).models;
  }
}
