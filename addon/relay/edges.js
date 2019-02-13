import { getFieldHasConnectionType } from './connection';
import { get } from '@ember/object';

export const mapRelayEdges = (records, typeName) =>
  records.map((record) => ({
    cursor: btoa(`${typeName}:${record.id}`),
    node: record
  }));

export const composeCreateRelayEdges = (mapRelayEdges) =>
  (records, { field }) => {
    let { fields, isRelayEdges } = field;

    if (isRelayEdges) {
      records = mapRelayEdges(records, get(fields, 'node.type.name'));
    }

    return records;
  };

export const createRelayEdges = composeCreateRelayEdges(mapRelayEdges);

export const composeGetIsEdge = (getFieldHasConnectionType) =>
  (fieldName, field) => fieldName === 'edges' &&
    getFieldHasConnectionType(get(field, 'parent.field.type.name'));

export const getIsEdge = composeGetIsEdge(getFieldHasConnectionType);
