import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { getIsEdge } from '../relay/edges';

const getEdgesNodeField = (fieldName, field, parent) =>
  getIsEdge(fieldName, parent) && field.fields.node;

const getMappedFieldName = (fieldName, typeName, fieldsMap = {}) =>
  typeName in fieldsMap && fieldsMap[typeName][fieldName];

const getTableName = (fieldName, typeName, fieldsMap) =>
  getMappedFieldName(fieldName, typeName, fieldsMap) ||
    pluralize(camelize(typeName));

export function getAllRecordsByType(fieldName, field, db, options, meta) {
  let { fieldsMap } = options || {};
  let edgesNodeField = getEdgesNodeField(fieldName, field, meta.parent);
  let typeName = (edgesNodeField || field).typeInfo.type.name;
  let table = db[getTableName(fieldName, typeName, fieldsMap)] || [{}];

  if (edgesNodeField) {
    meta.isRelayEdges = true;
  }

  return table.slice(0);
}
