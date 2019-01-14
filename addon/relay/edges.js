import { applyRelayFilters } from './filters';
import { createPageInfo } from './page-info';
import { fieldHasConnectionType } from './connection';

export const getIsEdge = (fieldName, parent) =>
  fieldName === 'edges' && fieldHasConnectionType(parent)

const mapRecordToEdge = (typeName) => (record) => ({
  cursor: btoa(`${typeName}:${record.id}`),
  node: record
});

export function getEdgesAndPageInfo(records, filters = [], typeName) {
  let edges = [];
  let hasRecords = !!records.length;
  let firstRecordId = hasRecords && records[0].id;
  let lastRecordId = hasRecords && records[records.length - 1].id;

  if (hasRecords) {
    edges = applyRelayFilters(records, filters).map(mapRecordToEdge(typeName));
  }

  let pageInfo = createPageInfo(edges, firstRecordId, lastRecordId, typeName);

  return [edges, pageInfo];
}
