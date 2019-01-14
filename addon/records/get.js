import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { getIsEdge } from '../relay/edges';

const getEdgesNodeField = (fieldName, field, parent) =>
  getIsEdge(fieldName, parent) && field.fields.node;

const getMappedFieldName = (fieldName, typeName, fieldsMap = {}) =>
  typeName in fieldsMap && fieldsMap[typeName][fieldName];

const getTableName = (fieldName, typeName, fieldsMap) =>
  getMappedFieldName(fieldName, typeName, fieldsMap) ||
    pluralize(camelize(typeName));

const getTypeName = (fieldName, field, parent) =>
  (getEdgesNodeField(fieldName, field, parent) || field).typeInfo.type.name;

export function getAllRecordsByType(fieldName, field, db, options, parent) {
  let { fieldsMap } = options || {};
  let typeName = getTypeName(fieldName, field, parent)
  let table = db[getTableName(fieldName, typeName, fieldsMap)] || [{}];

  return table.slice(0);
}
