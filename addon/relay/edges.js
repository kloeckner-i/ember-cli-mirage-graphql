import { fieldHasConnectionType } from './connection';

export const getIsEdge = (fieldName, field) =>
  fieldName === 'edges' && fieldHasConnectionType(field.parent.field.type.name);

const getRecordToEdgeMapper = (typeName) =>
  (record) => ({
    cursor: btoa(`${typeName}:${record.id}`),
    node: record
  });

export function createRelayEdges(records, { field }) {
  let { fields, isRelayEdges } = field;

  if (isRelayEdges) {
    records = records.map(getRecordToEdgeMapper(fields.node.type.name));
  }

  return records;
}
