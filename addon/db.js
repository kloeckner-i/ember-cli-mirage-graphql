import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { getMappedFieldNameByParentType } from './fields/name/map';

export const getTableName = (typeName) => camelize(pluralize(typeName));

export const composeGetRecords = (getTableName) =>
  (db, typeName) => db[getTableName(typeName)];

export const getRecords = composeGetRecords(getTableName);

export const composeGetTableNameForField = (getMappedFieldName, getTableName) =>
  (fieldName, parent, typeName, fieldsMap) =>
    getMappedFieldName(fieldName, parent, fieldsMap) || getTableName(typeName);

export const getTableNameForField =
  composeGetTableNameForField(getMappedFieldNameByParentType, getTableName);
