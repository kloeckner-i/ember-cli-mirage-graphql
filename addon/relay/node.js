import { applyRelayFilters, reduceRelayFilters } from './filters';
import { createPageInfo } from './page-info';
import { get } from '@ember/object';
import { mapRecordToEdge } from './edge';

export const getIsRelayNode = (fieldName, parent) => fieldName === 'node'
  && parent.fieldName === 'edges' && parent
  && !!get(parent, 'parent.meta.relayConnection');

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
