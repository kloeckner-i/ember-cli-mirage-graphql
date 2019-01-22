import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { getIsEdge } from '../relay/edges';
import { isFunction } from '../utils';

const getEdgesNodeField = (fieldName, field) =>
  getIsEdge(fieldName, field) && field.fields.node;

const getMappedFieldName = (fieldName, typeName, fieldsMap = {}) =>
  typeName in fieldsMap && fieldsMap[typeName][fieldName];

const getTableName = (fieldName, typeName, fieldsMap) =>
  getMappedFieldName(fieldName, typeName, fieldsMap) ||
    pluralize(camelize(typeName));

export function getAllRecordsByType(fieldName, field, db, options) {
  let { fieldsMap } = options || {};
  let edgesNodeField = getEdgesNodeField(fieldName, field);
  let typeName = (edgesNodeField || field).type.name;
  let table = db[getTableName(fieldName, typeName, fieldsMap)] || [{}];

  return table.slice(0);
}

export function getRecordsByMappedFieldFn(records, field, fieldName, db, options = {}) {
  if (!field.parent) return records;

  let { fieldsMap = {} } = options;
  let fieldsMapForType = fieldsMap[field.parent.field.type.name];
  let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

  if (isFunction(resolvedFieldName)) {
    let parent = field.parent.field.isRelayConnection
      ? field.parent.field.parent.record
      : field.parent.record;

    return resolvedFieldName(records, db, parent);
  }

  return records;
}
