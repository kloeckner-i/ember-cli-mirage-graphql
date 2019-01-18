import { camelize } from 'ember-cli-mirage/utils/inflector'
import { ensureList } from '../utils';
import { get } from '@ember/object';

const getHasParentRecord = ({ parent } = {}) =>
  parent && parent.record && !!Object.keys(parent.record).length;

function getParentInfo(parent, isRelayEdges) {
  let parentFieldName = parent.field.type.name;
  let parentRecord = parent.record;

  if (isRelayEdges) {
    parentFieldName = parent.field.parent.field.type.name;
    parentRecord = parent.field.parent.record;
  }

  return [camelize(parentFieldName), parentRecord];
}

const getParentRecordFilter = (parentFieldName) =>
  (record) => get(record, `${parentFieldName}.id`) === record.id

const filterByParent = (records, parent, parentFieldName, fieldName) =>
  parent[fieldName]
    ? ensureList(parent[fieldName])
    : records.filter(getParentRecordFilter(parentFieldName));

function resolveFieldName(fieldName, type, { fieldsMap = {} } = {}) {
  let fieldsMapForType = fieldsMap[type.name] || {};
  let mappedFieldName = fieldsMapForType[fieldName];

  return mappedFieldName || fieldName;
}

/*
  TODO

  1. Create filters from args and vars
   * Take special care with Relay args and find a way to build pageInfo
 */
export function filterRecords(records, field, fieldName, vars, options) {
  if (!records.length) return records;

  let resolvedFieldName = resolveFieldName(fieldName, field.type, options);

  if (getHasParentRecord(field)) {
    let [parentFieldName, parentRecord] = getParentInfo(field.parent,
      field.isRelayEdges);

    records = filterByParent(records, parentRecord, parentFieldName,
      resolvedFieldName);
  }

  return records;
}
