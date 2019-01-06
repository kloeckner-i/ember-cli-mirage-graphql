import { applyRelayFilters } from './filters';
import { createPageInfo } from './page-info';
import { get } from '@ember/object';
import { mapRecordToEdge } from './edge';

export const getIsRelayNode = (fieldName, parent) => fieldName === 'node'
  && parent.fieldName === 'edges'
  && !!get(parent, 'parent.meta.relayConnection');

export function handleRelayNode(records, parent, typeName) {
  let hasRecords = !!records.length;
  let firstRecordId = hasRecords && records[0].id;
  let lastRecordId = hasRecords && records[records.length - 1].id;
  let connection = { edges: records, pageInfo: createPageInfo() };

  if (hasRecords) {
    connection.edges = applyRelayFilters(records, parent)
      .map(mapRecordToEdge(typeName));
    connection.pageInfo = createPageInfo({
      edges: connection.edges,
      firstRecordId,
      lastRecordId,
      typeName
    });
  }

  parent.record = connection.edges;
  parent.parent.record = connection;
}
