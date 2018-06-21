import { get } from '@ember/object';
import { GraphQLList } from 'graphql';

const RELAY_VAR_NAMES = ['after', 'before', 'first', 'last'];
const TYPE_NAME_REGEX = /.+Connection$/;

export const getRelayPaginationType = (type) =>
  get(type, '_fields.edges.type.ofType._fields.node.type');

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
    records = records.slice(0, parseInt(before) - 1);
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
    mockInfo.setProperties({
      hasRelay,
      type: getRelayPaginationType(type)
    });
  }

  return mockInfo;
}

export function maybeWrapForRelay(mockInfo) {
  let { hasRelay, records, returnType } = mockInfo;

  if (hasRelay) {
    return {
      edges: records.map(mapRelay),
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false
      },
      totalCount: records.length
    };
  }

  return returnType instanceof GraphQLList ? records : records[0];
}

const hasRelayPagination = (name, fields) =>
  TYPE_NAME_REGEX.test(name) && 'edges' in fields && 'pageInfo' in fields;

const mapRelay = (record) => ({ cursor: record.id, node: record });

function getFirstOrLast(records, fn, direction, directionName) {
  if (direction < 0) {
    throw `Value of \`${directionName}\` cannot be less than 0`;
  }

  return fn(records);
}
