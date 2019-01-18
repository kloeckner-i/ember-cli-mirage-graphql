import { getEdgesAndPageInfo } from './edges';
import { getSelectedFields, getSelectedFieldsForList, getTypeForField } from
  '../fields/field-utils';
import { spliceRelayFilters } from './filters';

const CONNECTION_FIELDS = ['edges', 'pageInfo'];
const CONNECTION_TYPE_REGEX = /.+Connection$/;

export const fieldHasConnectionType = (typeName) =>
  CONNECTION_TYPE_REGEX.test(typeName);

const filterForConnectionFields = (fieldName) =>
  CONNECTION_FIELDS.includes(fieldName);

export const getIsRelayConnection = (typeName, fields) =>
  CONNECTION_TYPE_REGEX.test(typeName)
    && fields.filter(filterForConnectionFields).length
      === CONNECTION_FIELDS.length;

export const getIsRelayConnectionField = (fieldName, meta = {}) =>
  !!meta.relayConnection && CONNECTION_FIELDS.includes(fieldName);

// TODO: A lot could be named better here
export function handleRelayConnection(typeInfo, filters) {
  let splicedFilters = spliceRelayFilters(filters);

  typeInfo.meta = typeInfo.meta || {};
  typeInfo.meta.relayConnection = { filters: splicedFilters.relayFilters };

  return splicedFilters.filters;
}

export function resolveRelayConnectionField(options) {
  let { field, getAllRecordsByType, selectionSet, typeInfo } = options;
  let { meta, type } = typeInfo;

  if (field === 'edges') {
    let edgeType = getTypeForField(field, type);
    let nodeType = getTypeForField('node', edgeType.ofType);
    let [,, records] = getAllRecordsByType(null, nodeType);
    let [edges, pageInfo] = getEdgesAndPageInfo(records,
      meta.relayConnection.fitlers, nodeType.name);
    let resolvedEdges = getSelectedFieldsForList(edges, selectionSet.selections);

    meta.relayConnection.pageInfo = pageInfo;

    return resolvedEdges;
  } else {
    let resolvedPageInfo = getSelectedFields(meta.relayConnection.pageInfo,
      selectionSet.selections);

    return resolvedPageInfo;
  }
}

export function getRelayConnectionField(fieldName, meta, db) {
  if (fieldName === 'pageInfo') return meta.relayPageInfo;

  let [edges, pageInfo] = getEdgesAndPageInfo(fieldName, meta.parent, db);

  meta.relayPageInfo = pageInfo;

  return edges;
}
