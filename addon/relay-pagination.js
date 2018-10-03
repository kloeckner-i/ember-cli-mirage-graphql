import { camelize } from 'ember-cli-mirage/utils/inflector';
import { get } from '@ember/object';

const CONNECTION_FIELDS = ['edges', 'pageInfo'];
const CONNECTION_TYPE_REGEX = /.+Connection$/;
const RELAY_VAR_NAMES = ['after', 'before', 'first', 'last'];

const getRelayPaginationType = (type) =>
  get(type, '_fields.edges.type.ofType._fields.node.type');

const hasRelayPagination = (name, fields) =>
  CONNECTION_TYPE_REGEX.test(name) && 'edges' in fields && 'pageInfo' in fields;

const mapRelay = (record) => ({ cursor: record.id, node: record });

function getFirstOrLast(records, fn, direction, directionName) {
  if (direction < 0) {
    throw `Value of \`${directionName}\` cannot be less than 0`;
  }

  return fn(records);
}

function spliceRelayArgs(args) {
  let relayArgs = [];

  args = args.reduce((args, arg) => {
    RELAY_VAR_NAMES.includes(arg.name.value)
      ? relayArgs.push(arg)
      : args.push(arg);

    return args;
  }, []);

  return { args, relayArgs };
}

export const getIsRelayConnection = (type, fieldNode) =>
  CONNECTION_TYPE_REGEX.test(type.name)
    && fieldNode.selectionSet.selections.filter(({ name }) =>
      CONNECTION_FIELDS.includes(name.value)).length === 2;

export function abstractRelayVars(vars) {
  let otherVars = {};
  let relayVars = {};

  Object.keys(vars).forEach((key) => {
    let newVars = RELAY_VAR_NAMES.includes(key) ? relayVars : otherVars;

    newVars[key] = vars[key];
  });

  return { relayVars, vars: otherVars };
}

export function filterByRelayVars(records, relayVars) {
  let { before, after, first, last } = relayVars;

  if (after != null) {
    records = records.slice(parseInt(after));
  }

  if (before != null) {
    records = records.slice(0, parseInt(before) + 1);
  }

  if (first != null) {
    records = getFirstOrLast(records, (r) => r.slice(0, first), first, 'first');
  }

  if (last != null) {
    records = getFirstOrLast(records, (r) => r.slice(-last), last, 'last');
  }

  return records;
}

export function maybeUnwrapRelayType(mockInfo) {
  let { type } = mockInfo;
  let { name = '', _fields = {} } = type;
  let hasRelay = hasRelayPagination(name, _fields);

  if (hasRelay) {
    let unwrappedType = getRelayPaginationType(type);

    mockInfo.setProperties({
      hasRelay,
      type: unwrappedType
    });

    mockInfo.setMirageType(camelize(unwrappedType.name));
  }

  return mockInfo;
}

export function maybeWrapForRelay(mockInfo) {
  let { hasRelay, records } = mockInfo;

  if (hasRelay) {
    mockInfo.setRecords([{
      edges: records.map(mapRelay),
      // TODO: Actually compute these values
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false
      },
      /*
        TODO:
          This is a custom thing and should be made testable by mapping fields
          for the connection type
       */
      totalCount: records.length
    }]);
  }

  return mockInfo;
}

export function parseRelayConnection(typeInfo, args) {
  let splicedArgs = spliceRelayArgs(args);

  typeInfo.meta = typeInfo.meta || {};
  typeInfo.meta.relayConnection = { args: splicedArgs.relayArgs };

  return splicedArgs.args;
}
