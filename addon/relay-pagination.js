import { get } from '@ember/object';

const CONNECTION_FIELDS = ['edges', 'pageInfo'];
const CONNECTION_TYPE_REGEX = /.+Connection$/;
const RELAY_VAR_NAMES = ['after', 'before', 'first', 'last'];

function getFirstOrLast(records, fn, direction, directionName) {
  if (direction < 0) {
    throw `Value of \`${directionName}\` cannot be less than 0`;
  }

  return fn(records);
}

function spliceRelayFilters(filters) {
  let relayFilters = [];

  filters = filters.reduce((filters, filter) => {
    RELAY_VAR_NAMES.includes(filter.mappedKey)
      ? relayFilters.push(filter)
      : filters.push(filter);

    return filters;
  }, []);

  return { filters, relayFilters };
}

function applyRelayFilters(records, { after, before, first, last }) {
  if (after != null) {
    records = records.slice(after);
  }

  if (before != null) {
    records = records.slice(0, before + 1);
  }

  if (first != null) {
    records = getFirstOrLast(records, (r) => r.slice(0, first), first, 'first');
  }

  if (last != null) {
    records = getFirstOrLast(records, (r) => r.slice(-last), last, 'last');
  }

  return records;
}

function reduceRelayFilters(filters,  { key, value = {} }) {
  let { value: val } = value;

  if (val) {
    filters[key] = parseInt(val);
  }

  return filters;
}

const mapRecordToEdge = (typeName) => (record) => ({
  cursor: btoa(`${typeName}:${record.id}`),
  node: record
});

function createPageInfo(records, firstRecordId, lastRecordId, typeName) {
  let hasPreviousPage = records[0].id !== firstRecordId;
  let hasNextPage = records[records.length - 1].id !== lastRecordId;
  let afterCursor = hasPreviousPage
    ? btoa(`${typeName}:${parseInt(records[0].id) - 1}`)
    : null;
  let beforeCursor = hasNextPage
    ? btoa(`${typeName}:${parseInt(records[records.length - 1].id) + 1}`)
    : null;

  return { afterCursor, beforeCursor, hasNextPage, hasPreviousPage };
}

export const getIsRelayConnection = (type, fieldNode) =>
  CONNECTION_TYPE_REGEX.test(type.name)
    && fieldNode.selectionSet.selections.filter(({ name }) =>
      CONNECTION_FIELDS.includes(name.value)).length === 2;

export const getIsRelayNode = (fieldName, parent) => fieldName === 'node'
  && parent.fieldName === 'edges' && parent
  && !!get(parent, 'parent.meta.relayConnection');

export function handleRelayConnection(typeInfo, filters) {
  let splicedFilters = spliceRelayFilters(filters);

  typeInfo.meta = typeInfo.meta || {};
  typeInfo.meta.relayConnection = { filters: splicedFilters.relayFilters };

  return splicedFilters.filters;
}

export function handleRelayNode(records, parent, typeName) {
  let connection = {};
  let rawFilters = get(parent, 'parent.meta.relayConnection.filters');
  let filters = rawFilters.reduce(reduceRelayFilters, {});
  let firstRecordId = records[0].id;
  let lastRecordId = records[records.length - 1].id;

  records = applyRelayFilters(records, filters);

  connection.edges = records.map(mapRecordToEdge(typeName));
  connection.pageInfo = createPageInfo(records, firstRecordId, lastRecordId,
    typeName);

  parent.record = connection.edges;
  parent.parent.record = connection;
}
