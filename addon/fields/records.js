import createFilters from '../filter/create';
import filterRecords from '../filter/records';
import { getIsEdge } from '../relay/edges';
import { getTableName } from '../db';
import { isFunction } from '../utils';
import { resolveFieldName } from './name';

const getEdgesNodeField = (fieldName, field) =>
  getIsEdge(fieldName, field) && field.fields.node;

const getFieldsMapForType = (parent, fieldsMap) =>
  parent ? fieldsMap[parent.field.type.name] : fieldsMap;

const getMappedFieldName = (fieldName, parent, typeName, fieldsMap = {}) =>
  parent && parent.field.type.name in fieldsMap &&
    fieldsMap[parent.field.type.name][fieldName];

const getFieldTableName = (fieldName, parent, typeName, fieldsMap) =>
  getMappedFieldName(fieldName, parent, typeName, fieldsMap) ||
    getTableName(typeName);

function getAndFilterRecords(records, field, fieldName, db, vars, options) {
  let filters = createFilters(field, vars, options);
  let resolvedFieldName = resolveFieldName(fieldName, field.parent, options);

  records = getRecordsByField(fieldName, field, db, options);
  records = filterRecords(records, filters, field, resolvedFieldName);

  return records;
}

// TODO: Compose this function
export function getRecordsByField(fieldName, field, db, options) {
  let { fieldsMap = {} } = options || {};
  let edgesNodeField = getEdgesNodeField(fieldName, field);
  let typeName = (edgesNodeField || field).type.name;
  let tableName = getFieldTableName(fieldName, field.parent, typeName, fieldsMap);
  let table = db[tableName] || [{}];

  return table.slice(0);
}

// TODO: Compose this function
export function getRecordsInField(records, meta) {
  let { db, field, fieldName, options, vars } = meta;

  records = field.relayNode
    ? [field.relayNode]
    : field.relayPageInfo
      ? [field.relayPageInfo]
      : getAndFilterRecords(records, field, fieldName, db, vars, options);

  return records;
}

// TODO: Compose this function
export function getRecordsByMappedFieldFn(records, meta) {
  let { db, field, fieldName, options = {} } = meta;
  let { fieldsMap = {} } = options;
  let fieldsMapForType = getFieldsMapForType(field.parent, fieldsMap);
  let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

  if (isFunction(resolvedFieldName)) {
    let parent = !field.parent
      ? null
      : field.parent.field.isRelayConnection
        ? field.parent.field.parent.record
        : field.parent.record

    records = resolvedFieldName(records, db, parent);
  }

  return records;
}
