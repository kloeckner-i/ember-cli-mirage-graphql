import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { getIsEdge } from '../relay/edges';

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

  if (edgesNodeField) {
    field.isRelayEdges = true;
  }

  return table.slice(0);
}
