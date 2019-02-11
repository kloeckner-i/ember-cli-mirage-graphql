import { camelize } from 'ember-cli-mirage/utils/inflector'
import { ensureList } from '../utils';
import { get } from '@ember/object';

export function getParentInfo(parent, isRelayEdges) {
  let parentFieldName = parent.field.type.name;
  let parentRecord = parent.record;

  if (isRelayEdges) {
    parentFieldName = parent.field.parent.field.type.name;
    parentRecord = parent.field.parent.record;
  }

  return [camelize(parentFieldName), parentRecord];
}

export const filterByParentField = (parentFieldName, parentId, records) =>
  records.filter((record) => get(record, `${parentFieldName}.id`) === parentId);

export const composeFilterByParent = (getParentInfo, filterByParentField) =>
  (records, { field, fieldName }) => {
    if (!field.parent) {
      return records;
    }

    let [parentFieldName, parentRecord] = getParentInfo(field.parent,
      field.isRelayEdges);
    let { id: parentId } = parentRecord;

    return parentId == null
      ? records
      : parentRecord[fieldName]
        ? ensureList(parentRecord[fieldName])
        : filterByParentField(parentFieldName, parentId, records);
  };

const filterByParent = composeFilterByParent(getParentInfo, filterByParentField);

export default filterByParent;
