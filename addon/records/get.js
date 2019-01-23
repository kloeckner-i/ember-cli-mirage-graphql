import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { getIsEdge } from '../relay/edges';
import { isFunction } from '../utils';

const getEdgesNodeField = (fieldName, field) =>
  getIsEdge(fieldName, field) && field.fields.node;

const getFieldsMapForType = (parent, fieldsMap) =>
  parent ? fieldsMap[parent.field.type.name] : fieldsMap;

const getMappedFieldName = (fieldName, parent, typeName, fieldsMap = {}) =>
  parent && parent.field.type.name in fieldsMap &&
    fieldsMap[parent.field.type.name][fieldName];

const getTableName = (fieldName, parent, typeName, fieldsMap) =>
  getMappedFieldName(fieldName, parent, typeName, fieldsMap) ||
    pluralize(camelize(typeName));

export function getAllRecordsByType(fieldName, field, db, options) {
  let { fieldsMap = {} } = options || {};
  let edgesNodeField = getEdgesNodeField(fieldName, field);
  let typeName = (edgesNodeField || field).type.name;
  let tableName = getTableName(fieldName, field.parent, typeName, fieldsMap);
  let table = db[tableName] || [{}];

  return table.slice(0);
}

export function getRecordsByMappedFieldFn(records, field, fieldName, db, options = {}) {
  let { fieldsMap = {} } = options;
  let fieldsMapForType = getFieldsMapForType(field.parent, fieldsMap);
  let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

  if (isFunction(resolvedFieldName)) {
    let parent = !field.parent
      ? null
      : field.parent.field.isRelayConnection
        ? field.parent.field.parent.record
        : field.parent.record

    return resolvedFieldName(records, db, parent);
  }

  return records;
}
