import { camelize } from 'ember-cli-mirage/utils/inflector'
import { ensureList } from '../utils';
import { get } from '@ember/object';

function getParentInfo(parent, isRelayEdges) {
  let parentFieldName = parent.field.type.name;
  let parentRecord = parent.record;

  if (isRelayEdges) {
    parentFieldName = parent.field.parent.field.type.name;
    parentRecord = parent.field.parent.record;
  }

  return [camelize(parentFieldName), parentRecord];
}

const getParentRecordFilter = (parentFieldName, parentId) =>
  (record) => get(record, `${parentFieldName}.id`) === parentId;

// TODO: Compose this function
export function filterByParent(records, { field, fieldName }) {
  if (!field.parent) {
    return records;
  }

  let [parentFieldName, parent] = getParentInfo(field.parent, field.isRelayEdges);
  let { id: parentId } = parent;

  return parentId == null
    ? records
    : parent[fieldName]
      ? ensureList(parent[fieldName])
      : records.filter(getParentRecordFilter(parentFieldName, parentId));
}
