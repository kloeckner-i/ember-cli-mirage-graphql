import { camelize } from 'ember-cli-mirage/utils/inflector'
import { ensureList } from '../utils';
import { get } from '@ember/object';

// TODO: Add unit test for this
export function getParentInfo(parent, isRelayEdges) {
  let parentFieldName = parent.field.type.name;
  let parentRecord = parent.record;

  if (isRelayEdges) {
    parentFieldName = parent.field.parent.field.type.name;
    parentRecord = parent.field.parent.record;
  }

  return [camelize(parentFieldName), parentRecord];
}

// TODO: Add unit test for this
export const filterByParentField = (parentFieldName, parentId, records) =>
  records.filter((record) => get(record, `${parentFieldName}.id`) === parentId);

// TODO: Add unit test for this
export const composeFilterByParent = (getParentInfo, filterByParentField) =>
  (records, { field, fieldName }) => {
    if (!field.parent) {
      return records;
    }

    let [parentFieldName, parent] = getParentInfo(field.parent, field.isRelayEdges);
    let { id: parentId } = parent;

    return parentId == null
      ? records
      : parent[fieldName]
        ? ensureList(parent[fieldName])
        : filterByParentField(parentFieldName, parentId, records);
  };

const filterByParent = composeFilterByParent(getParentInfo, filterByParentField);

export default filterByParent;
